exports.getProjectSamples = async(req, res) => {
    const { id } = req.params;

    try {
        const [samples] = await db.execute(`
        SELECT s.*, u.username
        FROM research_samples s
        JOIN users u ON s.uploaded_by = u.id
        WHERE s.project_id = ?
      `, [id]);

        res.json({
            status: "success",
            code: 200,
            data: {
                samples: samples.map(sample => ({
                    id: sample.id,
                    sample_name: sample.sample_name,
                    file_path: sample.file_path,
                    duration_seconds: sample.duration_seconds,
                    format: sample.format,
                    sampling_rate: sample.sampling_rate,
                    channel_count: sample.channel_count,
                    notes: sample.notes,
                    uploaded_by: {
                        id: sample.uploaded_by,
                        username: sample.username
                    },
                    upload_date: sample.upload_date
                }))
            },
            message: "Sampel penelitian berhasil diambil"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", code: 500, message: "Server error" });
    }
};