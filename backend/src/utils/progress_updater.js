async function updateProgress(request, lessonId, phase, progress) {
  await request.server.db.query(
    `
    UPDATE lessons
    SET
      processing_phase = $1,
      processing_progress = $2,
      status = CASE
        WHEN $1 = 'done' THEN 'ready'
        WHEN $1 = 'failed' THEN 'failed'
        ELSE 'processing'
      END
    WHERE id = $3
    `,
    [phase, progress, lessonId],
  );
}
export { updateProgress };
