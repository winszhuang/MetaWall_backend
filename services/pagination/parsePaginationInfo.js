/** 預設一頁幾筆資料 */
const DEFAULT_PAGE_SIZE = 10;
/** 預設第幾頁 */
const DEFAULT_PAGE_INDEX = 1;

/**
 * 轉換request中pageIndex和pageSize資訊為mongoose可控制頁數的資料
 * @param {Request} req
 */
function parsePaginationInfo(req) {
  const { pageIndex, pageSize } = req.query;

  const currentPageIndex = parseInt(pageIndex, 10) || DEFAULT_PAGE_INDEX;
  const currentPageSize = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE;

  return {
    skip: (currentPageIndex - 1) * currentPageSize,
    limit: currentPageSize,
  };
}

module.exports = parsePaginationInfo;
