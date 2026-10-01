// Импортируем картинки из папки assets
// Убедитесь, что названия файлов совпадают с теми, что вы скачали
import catBedroom from '@/assets/images/cat-bedroom.jpg';
import catBathroom from '@/assets/images/cat-bathroom.jpg';
import catOffice from '@/assets/images/cat-office.jpg';
import catLivingRoom from '@/assets/images/cat-living-room.jpg';
import catKitchen from '@/assets/images/cat-kitchen.jpg';
import catGarden from '@/assets/images/cat-garden.jpg';
import catKids from '@/assets/images/cat-kids.jpg';
import catDining from '@/assets/images/cat-dining.jpg';
import catCorridor from '@/assets/images/cat-corridor.jpg';
import catLaundry from '@/assets/images/cat-laundry.jpg';
import catStorage from '@/assets/images/cat-storage.jpg';
import catSleep from '@/assets/images/cat-sleep.jpg';

export interface Category {
  id: string;
  name: string;
  image: string;
  span: string;
}

export const categoriesMockData: Category[] = [
  { id: '1', name: 'Спальня', image: catBedroom, span: 'col-span-1' },
  { id: '2', name: 'Ванна', image: catBathroom, span: 'col-span-1' },
  { id: '3', name: 'Офіс', image: catOffice, span: 'col-span-1' },
  { id: '4', name: 'Вітальня', image: catLivingRoom, span: 'col-span-1' },
  { id: '5', name: 'Кухня', image: catKitchen, span: 'col-span-1' },
  { id: '6', name: 'Для саду', image: catGarden, span: 'col-span-1' },
  { id: '7', name: 'Дитяча кімната', image: catKids, span: 'col-span-1' },
  { id: '8', name: 'Їдальня', image: catDining, span: 'col-span-1' },
  { id: '9', name: 'Коридор', image: catCorridor, span: 'col-span-1' },
  { id: '10', name: 'Пральня', image: catLaundry, span: 'col-span-1' },
  { id: '11', name: 'Зберігання', image: catStorage, span: 'col-span-1' },
  { id: '12', name: 'Для сну', image: catSleep, span: 'col-span-1' }
];