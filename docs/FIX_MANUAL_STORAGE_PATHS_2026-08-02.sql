BEGIN;

UPDATE public.manual_chunks
SET pdf_storage_path = 'UHB-Unimog-Cargo.pdf'
WHERE manual_title = 'UHB Unimog Cargo'
  AND pdf_storage_path = 'handbooks/UHB-Unimog-Cargo.pdf';

UPDATE public.manual_chunks
SET pdf_storage_path = 'UHB-Unimog-Crane-661128976.pdf'
WHERE manual_title = 'UHB Unimog Crane 661128976'
  AND pdf_storage_path = 'handbooks/UHB-Unimog-Crane-661128976.pdf';

UPDATE public.manual_chunks
SET pdf_storage_path = 'unimog compressor.pdf'
WHERE manual_title = 'unimog compressor'
  AND pdf_storage_path = 'specialized/unimog-compressor.pdf';

UPDATE public.manual_chunks
SET pdf_storage_path = 'RPS-02157-Unimog-with-Crane.pdf'
WHERE manual_title = 'RPS 02157 Unimog with Crane'
  AND pdf_storage_path = 'rps/RPS-02157-Unimog-with-Crane.pdf';

UPDATE public.manual_chunks
SET pdf_storage_path = 'RPS-02202-Unimog-GS-with-Twist-Locks.pdf'
WHERE manual_title = 'RPS 02202 Unimog GS with Twist Locks'
  AND pdf_storage_path = 'rps/RPS-02202-Unimog-GS-with-Twist-Locks.pdf';

UPDATE public.manuals
SET filename = 'UHB-Unimog-Cargo.pdf'
WHERE title = 'UHB Unimog Cargo'
  AND filename = 'UHB Unimog Cargo.pdf';

COMMIT;
