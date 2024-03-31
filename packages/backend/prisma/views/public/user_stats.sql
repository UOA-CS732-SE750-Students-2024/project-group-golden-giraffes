SELECT
  lb.user_id,
  lb.canvas_id,
  lb.total_pixels,
  lb.rank,
  mfc.color_id AS most_frequent_color_id,
  mfc.count AS color_count,
  cpf.median_time_diff AS place_frequency,
  h.most_recent_timestamp
FROM
  (
    (
      (
        leaderboard lb
        LEFT JOIN most_frequent_color mfc ON (
          (
            (lb.canvas_id = mfc.canvas_id)
            AND (lb.user_id = mfc.user_id)
          )
        )
      )
      LEFT JOIN color_place_frequency cpf ON (
        (
          (lb.canvas_id = cpf.canvas_id)
          AND (lb.user_id = cpf.user_id)
        )
      )
    )
    LEFT JOIN (
      SELECT
        history.user_id,
        history.canvas_id,
        max(history."timestamp") AS most_recent_timestamp
      FROM
        history
      GROUP BY
        history.user_id,
        history.canvas_id
    ) h ON (
      (
        (lb.canvas_id = h.canvas_id)
        AND (lb.user_id = h.user_id)
      )
    )
  );