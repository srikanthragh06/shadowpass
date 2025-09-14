CREATE TABLE IF NOT EXISTS "Vaults" (
    "id" SERIAL PRIMARY KEY,
    "masterToken" TEXT NOT NULL,
    "username" TEXT UNIQUE NOT NULL,
    "vault" TEXT
);

CREATE INDEX idx_vault_mastertoken_username
ON "Vaults" ("username","masterToken");

CREATE TABLE IF NOT EXISTS "Settings" (
    "id" SERIAL PRIMARY KEY,
    "vaultId" INTEGER NOT NULL,
    "autoLockTimeInterval" INTEGER NOT NULL DEFAULT 3600,
    "autoLockOnSiteRefresh" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_vault
        FOREIGN KEY ("vaultId")
        REFERENCES "Vaults"("id")
        ON DELETE CASCADE
);

CREATE INDEX idx_settings_vaultid
ON "Settings" ("vaultId");

