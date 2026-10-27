
# Hyggy — Backup and Disaster Recovery

## 1. Overview

The Hyggy application runs on an AWS EC2 instance using Docker Compose.

The backup solution protects two components:
- MySQL 8.0 — application database
- MinIO — object storage for product images and user files

Backups are uploaded to a private Amazon S3 bucket.

## 2. Backup Infrastructure

| Component | Configuration |
|---|---|
| Cloud provider | AWS |
| Region | eu-north-1 |
| Compute | EC2 t3.micro |
| Backup storage | Amazon S3 |
| S3 bucket | hyggy-backups-920503695956 |
| Encryption | SSE-S3 |
| Bucket versioning | Enabled |
| Public access | Blocked |
| Backup retention | 30 days |
| Authentication | EC2 IAM Role |

The EC2 instance uses the IAM role `hyggy-ec2-s3-backup-role` to access the backup bucket without storing AWS access keys.

## 3. Automated Backups

Backup scripts are stored on the EC2 instance:

- `/home/ubuntu/hyggy-backup-scripts/backup-mysql.sh`
- `/home/ubuntu/hyggy-backup-scripts/backup-minio.sh`

Cron schedules:

| Service | UTC | Kyiv winter time |
|---|---|---|
| MySQL | 03:00 | 05:00 |
| MinIO | 03:15 | 05:15 |

Backup logs:

- `backup-mysql.log`
- `backup-minio.log`

Both scripts have been successfully tested manually. The first scheduled cron execution is pending verification.

## 4. Amazon S3 Storage

MySQL backups are stored under:

`s3://hyggy-backups-920503695956/mysql/`

MinIO backups are stored under:

`s3://hyggy-backups-920503695956/minio/`

The bucket uses SSE-S3 encryption, versioning, blocked public access, and a lifecycle rule for automatic expiration of backups.

## 5. MySQL Recovery Test

A MySQL backup was downloaded from Amazon S3 and restored into an isolated test database named `hyggy_restore_test`.

Results:

- SQL dump downloaded successfully
- SQL import completed without errors
- 19 database tables restored
- 61 products verified
- Production database remained unchanged
- Test database deleted after validation

**Status: Passed**

## 6. MinIO Recovery Test

A MinIO backup archive was downloaded from Amazon S3 into a separate test directory.

Results:

- Archive downloaded successfully
- GZIP integrity check passed
- Archive extracted successfully
- 159 filesystem files found
- Extracted data size: approximately 3.2 MB
- Product image and avatar object data detected

The backup contains MinIO internal metadata and object data. A complete recovery test using the MinIO API has not yet been performed.

**Status: Partial — API-level recovery validation pending**

## 7. Recovery Considerations

- Restore MySQL backups into an isolated database before replacing production data.
- Validate restored table structures and application records.
- Restore MinIO volume backups only into a compatible, isolated MinIO environment.
- Never extract a backup directly over a running production MinIO volume.
- Keep database credentials and application secrets out of Git.
- Verify automated backup logs and S3 objects regularly.
- Periodically test full recovery procedures.

## 8. Current Limitations

- The first scheduled cron backup run has not yet been verified.
- MinIO API-level recovery remains untested.
- MySQL and MinIO backups are created separately, so they do not guarantee a single consistent point-in-time snapshot.
- Backup retention is limited to the configured S3 lifecycle period.
- Recovery time and recovery point objectives have not yet been formally measured.

## 9. Conclusion

The Hyggy project implements off-instance backup storage using Amazon S3, IAM-based authentication, encryption, retention policies, and scheduled backup scripts.

MySQL recovery has been successfully tested. MinIO archive integrity and extraction have been verified, with full object-level recovery testing planned separately.
