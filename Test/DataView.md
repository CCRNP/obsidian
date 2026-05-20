TABLE 类型, 日期, 花费, 状态
FROM "日记" OR "家庭"
WHERE 日期 >= date(today) - dur(30 days)
SORT 日期 DESC

```dataview
TABLE 类型, 日期, 花费, 状态
FROM "Test/TestDataView"
WHERE 日期 >= date(today) - dur(30 days)
SORT 日期 DESC
```

