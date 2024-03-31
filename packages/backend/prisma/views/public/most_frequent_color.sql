SELECT
  DISTINCT ON (history.user_id, history.canvas_id) history.user_id,
  history.canvas_id,
  history.color_id,
  count(*) AS count
FROM
  history
GROUP BY
  history.user_id,
  history.color_id,
  history.canvas_id
ORDER BY
  history.user_id,
  history.canvas_id,
  (count(*)) DESC;