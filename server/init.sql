-- Vault table
CREATE TABLE IF NOT EXISTS "Vaults" (
    "authToken" VARCHAR(255) PRIMARY KEY,
    "username" TEXT NOT NULL,
    "vault" TEXT
);

-- Settings table
CREATE TABLE IF NOT EXISTS "Settings" (
    "authToken" VARCHAR(255) PRIMARY KEY,
    "autoLockTimeInterval" INTEGER NOT NULL,
    "autoLockOnSiteRefresh" BOOLEAN NOT NULL
);
