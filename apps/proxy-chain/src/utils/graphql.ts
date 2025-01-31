interface GetDataResponse<TItem> {
  items: Array<TItem | null> | undefined;
  nextToken?: string | null;
}

export type GetDataFn<T, K> = (
  params: K,
  nextToken?: string | null,
) => Promise<GetDataResponse<T> | null | undefined>;

export const getAllPagesOfData = async <T, K>(
  getDataFunc: GetDataFn<T, K>,
  params: K,
): Promise<Array<T | null>> => {
  const items = [];
  let nextToken = null;

  do {
    const data: GetDataResponse<T> | null | undefined = await getDataFunc(
      { ...params },
      nextToken,
    );
    nextToken = data?.nextToken;
    if (data?.items) {
      items.push(...data.items);
    }
  } while (nextToken);

  return items;
};
