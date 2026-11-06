import re
from dataclasses import dataclass

from rapidfuzz import fuzz, process

EN_TO_UK = dict(
    zip(
        "qwertyuiop[]asdfghjkl;'zxcvbnm,.`",
        "йцукенгшщзхїфівапролджєячсмитьбю'",
    )
)
UK_TO_EN = {uk: en for en, uk in EN_TO_UK.items()}
UK_TO_EN.update({"ы": "s", "э": "'", "ъ": "]", "ё": "`"})

TRANSLIT = {
    "а": "a", "б": "b", "в": "v", "г": "h", "ґ": "g", "д": "d", "е": "e", "є": "ie",
    "ж": "zh", "з": "z", "и": "y", "і": "i", "ї": "i", "й": "i", "к": "k", "л": "l",
    "м": "m", "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
    "ф": "f", "х": "kh", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "shch", "ь": "",
    "ю": "iu", "я": "ia", "ы": "y", "э": "e", "ъ": "", "'": "",
}

APOSTROPHES = re.compile(r"[ʼ’`´']")
NON_WORD = re.compile(r"[^\w']+")


@dataclass
class SearchResult:
    ids: list[int]
    did_you_mean: str | None


def normalize(text: str) -> str:
    text = APOSTROPHES.sub("'", text.lower()).replace("ё", "е")
    return " ".join(NON_WORD.sub(" ", text).split())


def swap_layout(text: str) -> str:
    latin = sum(1 for char in text if "a" <= char <= "z")
    cyrillic = sum(1 for char in text if "а" <= char <= "я" or char in "іїєґ")
    table = EN_TO_UK if latin >= cyrillic else UK_TO_EN
    return "".join(table.get(char, char) for char in text)


def transliterate(text: str) -> str:
    return "".join(TRANSLIT.get(char, char) for char in text)


def min_score(token: str) -> float | None:
    if len(token) <= 2:
        return None
    if len(token) <= 4:
        return 75
    if len(token) <= 7:
        return 70
    return 65


def token_score(query_token: str, name_tokens: list[str]) -> float:
    best = 0.0
    threshold = min_score(query_token)
    for name_token in name_tokens:
        if name_token.startswith(query_token):
            return 100.0
        if threshold is None:
            continue
        score = fuzz.ratio(query_token, name_token)
        if len(name_token) > len(query_token):
            score = max(score, fuzz.ratio(query_token, name_token[: len(query_token)]))
        if score >= threshold and score > best:
            best = score
    return best


def token_forms(token: str) -> list[str]:
    forms = [token]
    for form in (normalize(swap_layout(token)), normalize(transliterate(token))):
        if form and form not in forms:
            forms.append(form)
    return forms


def score_name(query: str, forms_per_token: list[list[str]], name: str) -> float:
    normalized_name = normalize(name)
    name_tokens = normalized_name.split()
    scores = [
        max(token_score(form, name_tokens) for form in forms) for forms in forms_per_token
    ]
    if not scores or min(scores) == 0:
        return 0.0
    score = sum(scores) / len(scores)
    if max(token_score(form, name_tokens[:1]) for form in forms_per_token[0]) > 0:
        score += 20
    if query in normalized_name:
        score += 100
        if normalized_name.startswith(query):
            score += 50
    return score


def rank(query: str, rows: list[tuple[int, str]]) -> dict[int, float]:
    forms_per_token = [token_forms(token) for token in query.split()]
    ranked = {}
    for product_id, name in rows:
        score = score_name(query, forms_per_token, name)
        if score > 0:
            ranked[product_id] = score
    return ranked


def build_vocabulary(rows: list[tuple[int, str]]) -> dict[str, str]:
    vocabulary = {}
    for _, name in rows:
        for original in name.split():
            for part in re.split(r"[-/]", original):
                key = normalize(part)
                if len(key) > 2 and key not in vocabulary:
                    vocabulary[key] = part
    return vocabulary


def correct_token(token: str, vocabulary: dict[str, str]) -> str:
    words = list(vocabulary)
    best_score, best_word = 0.0, token
    for form in token_forms(token):
        if form in vocabulary:
            return vocabulary[form]
        if any(word.startswith(form) for word in words):
            if best_score < 100:
                best_score, best_word = 100, form
            continue
        threshold = min_score(form)
        if threshold is None:
            continue
        match = process.extractOne(form, words, scorer=fuzz.ratio, score_cutoff=threshold)
        if match and match[1] > best_score:
            best_score, best_word = match[1], vocabulary[match[0]]
    return best_word


def search(raw_query: str, rows: list[tuple[int, str]]) -> SearchResult:
    query = normalize(raw_query)
    if not query:
        return SearchResult(ids=[], did_you_mean=None)

    ranked = rank(query, rows)
    if not ranked or any(query in normalize(name) for _, name in rows):
        return SearchResult(ids=sort_ids(ranked, rows), did_you_mean=None)

    vocabulary = build_vocabulary(rows)
    suggestion = " ".join(correct_token(token, vocabulary) for token in query.split())
    did_you_mean = suggestion if normalize(suggestion) != query else None
    return SearchResult(ids=sort_ids(ranked, rows), did_you_mean=did_you_mean)


def sort_ids(ranked: dict[int, float], rows: list[tuple[int, str]]) -> list[int]:
    names = dict(rows)
    return sorted(ranked, key=lambda product_id: (-ranked[product_id], names[product_id]))