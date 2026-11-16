# External VPS image storage

The API defaults to Replit App Storage. For a persistent external VPS, set:

- `HERO_IMAGE_STORAGE=local`
- `HERO_IMAGE_SERVICE_URL=http://127.0.0.1:4100`
- `UPLOAD_TOKEN` to the existing local image service token (server-side only)

The image service uses Express 4, multer 1.4.5-lts.2, and file-type 19.
Retain its existing `IMAGE_STORE_DIR` on persistent disk and its service unit.
Never expose port 4100 or its upload token to browsers.

The admin UI's existing upload contract remains unchanged. The API issues a
10-minute HMAC-signed URL bound to the image UUID, MIME type, and byte length.
The browser PUTs to the API; the API verifies the ticket before forwarding to
the private service. The service validates actual file type, caps uploads at
10 MiB, and uses exclusive writes so tickets cannot overwrite an existing image.
Public image delivery still goes through `/api/site/hero-image`, which serves
only the image currently saved in site settings.

Set Nginx `client_max_body_size 11m` for the API location, test its configuration,
then reload it. Back up source, built API files, service overrides, and Nginx
configuration before changing a running installation. Do not reset its database
or copy Replit secrets over the VPS's own credentials.

Existing Replit object paths refer to another storage system. Files already
uploaded on Replit must be exported and migrated separately; switching the
storage backend does not copy those bytes.
