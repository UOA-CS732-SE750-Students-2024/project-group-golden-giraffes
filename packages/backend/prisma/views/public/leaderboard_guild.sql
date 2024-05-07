SELECT
  history.user_id,
  history.canvas_id,
  history.guild_id,
  history.discord_user_profile,
  count(*) AS total_pixels,
  rank() OVER (
    PARTITION BY history.canvas_id,
    history.guild_id
    ORDER BY
      (count(*)) DESC
  ) AS rank
FROM
  history
GROUP BY
  history.user_id,
  history.canvas_id,
  history.guild_id;
