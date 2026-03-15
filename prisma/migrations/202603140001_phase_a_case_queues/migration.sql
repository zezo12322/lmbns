CREATE TYPE "ManagerReviewState" AS ENUM ('NOT_SENT', 'PENDING', 'APPROVED', 'REJECTED');

CREATE TYPE "NationalIdValidationStatus" AS ENUM ('UNKNOWN', 'VALID', 'INVALID');

ALTER TABLE "Person"
ADD COLUMN "nationalIdValidationStatus" "NationalIdValidationStatus" NOT NULL DEFAULT 'UNKNOWN';

ALTER TABLE "Case"
ADD COLUMN "managerReviewState" "ManagerReviewState" NOT NULL DEFAULT 'NOT_SENT';

CREATE INDEX "Person_nationalIdValidationStatus_idx" ON "Person"("nationalIdValidationStatus");
CREATE INDEX "Case_status_priority_createdAt_idx" ON "Case"("status", "priority", "createdAt");
CREATE INDEX "Case_managerReviewState_status_updatedAt_idx" ON "Case"("managerReviewState", "status", "updatedAt");
