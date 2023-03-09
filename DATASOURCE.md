# initproject_logs

initproject_logs  table  structure

```sql
-- Drop table

-- DROP TABLE initproject_logs;

CREATE TABLE initproject_logs (
	id serial NOT NULL,
	"timestamp" timestamp NULL DEFAULT now(), -- log 时间戳
	"exception" text NULL, -- log exception
	"level" varchar(50) NULL, -- log level
	message text NULL, -- log message
	log_event jsonb NULL, -- log evet
	"function" varchar(100) NULL, -- error function
	CONSTRAINT device_detection_pkey PRIMARY KEY (id)
);

-- Column comments

COMMENT ON COLUMN initproject_logs."timestamp" IS 'log 时间戳';
COMMENT ON COLUMN initproject_logs."exception" IS 'log exception';
COMMENT ON COLUMN initproject_logs."level" IS 'log level';
COMMENT ON COLUMN initproject_logs.message IS 'log message';
COMMENT ON COLUMN initproject_logs.log_event IS 'log evet';
COMMENT ON COLUMN initproject_logs."function" IS 'error function';
```
