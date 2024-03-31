SELECT
  lb.guild_id,
  lb.canvas_id,
  lb.total_pixels,
  mfc.color_id AS most_frequent_color_id,
  mfc.count AS color_count,
  cpf.median_time_diff AS place_frequency,
  h.most_recent_timestamp
FROM
  (
    (
      (
        (
          SELECT
            leaderboard_guild.canvas_id,
            leaderboard_guild.guild_id,
            (sum(leaderboard_guild.total_pixels)) :: integer AS total_pixels
          FROM
            leaderboard_guild
          GROUP BY
            leaderboard_guild.canvas_id,
            leaderboard_guild.guild_id
        ) lb
        LEFT JOIN most_frequent_color_guild mfc ON (
          (
            (lb.canvas_id = mfc.canvas_id)
            AND (lb.guild_id = mfc.guild_id)
          )
        )
      )
      LEFT JOIN color_place_frequency_guild cpf ON (
        (
          (lb.canvas_id = cpf.canvas_id)
          AND (lb.guild_id = cpf.guild_id)
        )
      )
    )
    LEFT JOIN (
      SELECT
        history.guild_id,
        history.canvas_id,
        max(history.timestamp) AS most_recent_timestamp
      FROM
        history
      GROUP BY
        history.guild_id,
        history.canvas_id
    ) h ON (
      (
        (lb.canvas_id = h.canvas_id)
        AND (lb.guild_id = h.guild_id)
      )
    )
  );
