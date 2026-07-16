UPDATE `cms_media`
SET `filename` = substr(`storage_key`, 13)
WHERE `storage_key` GLOB 'cms/[0-9][0-9][0-9][0-9]/[0-9][0-9]/*';
