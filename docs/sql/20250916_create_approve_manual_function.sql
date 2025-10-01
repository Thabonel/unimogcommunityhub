-- Create the approve_manual_for_processing function
CREATE OR REPLACE FUNCTION approve_manual_for_processing(pending_upload_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    pending_record RECORD;
    new_manual_id UUID;
    current_user_id UUID;
BEGIN
    -- Get current user ID
    SELECT auth.uid() INTO current_user_id;

    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    -- Get the pending upload record
    SELECT * INTO pending_record
    FROM pending_manual_uploads
    WHERE id = pending_upload_id AND approval_status = 'pending';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pending upload not found or already processed';
    END IF;

    -- Update the pending upload to approved status
    UPDATE pending_manual_uploads
    SET
        approval_status = 'approved',
        approved_by = current_user_id,
        approved_at = NOW(),
        updated_at = NOW()
    WHERE id = pending_upload_id;

    -- Create the processed manual record
    INSERT INTO processed_manuals (
        filename,
        original_filename,
        title,
        description,
        category,
        model_codes,
        year_range,
        file_size,
        processing_status,
        uploaded_by,
        approved_by,
        created_at,
        updated_at
    ) VALUES (
        pending_record.filename,
        pending_record.original_filename,
        pending_record.title,
        pending_record.description,
        pending_record.category,
        pending_record.model_codes,
        pending_record.year_range,
        pending_record.file_size,
        'pending',
        pending_record.uploaded_by,
        current_user_id,
        NOW(),
        NOW()
    ) RETURNING id INTO new_manual_id;

    RETURN new_manual_id;
END;
$$;

-- Create the reject_manual_upload function if it doesn't exist
CREATE OR REPLACE FUNCTION reject_manual_upload(pending_upload_id UUID, reason TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_id UUID;
BEGIN
    -- Get current user ID
    SELECT auth.uid() INTO current_user_id;

    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    -- Update the pending upload to rejected status
    UPDATE pending_manual_uploads
    SET
        approval_status = 'rejected',
        approved_by = current_user_id,
        approved_at = NOW(),
        rejection_reason = reason,
        updated_at = NOW()
    WHERE id = pending_upload_id AND approval_status = 'pending';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pending upload not found or already processed';
    END IF;

    RETURN TRUE;
END;
$$;