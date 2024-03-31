SELECT
  DISTINCT ON (history.guild_id, history.canvas_id) history.guild_id,
  history.canvas_id,
  history.color_id,
  count(*) AS count
FROM
  history
GROUP BY
  history.guild_id,
  history.color_id,
  history.canvas_id
ORDER BY
  history.guild_id,
  history.canvas_id,
  (count(*)) DESC;