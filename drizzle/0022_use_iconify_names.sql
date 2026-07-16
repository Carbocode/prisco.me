UPDATE `skills`
SET `icon` = CASE
  WHEN `icon` = 'openai' THEN 'logos:openai-icon'
  WHEN instr(`icon`, ':') = 0 THEN 'simple-icons:' || `icon`
  ELSE `icon`
END
WHERE `icon` IS NOT NULL;

UPDATE `cms_tags`
SET `icon` = CASE
  WHEN `icon` = 'openai' THEN 'logos:openai-icon'
  WHEN instr(`icon`, ':') = 0 THEN 'simple-icons:' || `icon`
  ELSE `icon`
END
WHERE `icon` IS NOT NULL;
