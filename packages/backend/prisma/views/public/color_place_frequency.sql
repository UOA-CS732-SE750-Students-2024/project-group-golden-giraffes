WITH time_diffs AS (
  SELECT
    history.user_id,
    history.canvas_id,
    (
      history."timestamp" - lag(history."timestamp") OVER (
        PARTITION BY history.user_id,
        history.canvas_id
        ORDER BY
          history."timestamp"
      )
    ) AS time_diff
  FROM
    history
  ORDER BY
    history."timestamp"
)
SELECT
  t.user_id,
  t.canvas_id,
  percentile_cont((0.5) :: double precision) WITHIN GROUP (
    ORDER BY
      t.time_diff
  ) AS median_time_diff
FROM
  time_diffs t
WHERE
  (t.time_diff > '00:00:00.1' :: INTERVAL)
GROUP BY
  t.user_id,
  t.canvas_id
HAVING
  (count(*) > 1);