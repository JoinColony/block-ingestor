type UpsertInput<TFetchResult, TCreateResult, TUpdateResult> = {
  fetchItem: () => Promise<TFetchResult>;
  create: () => Promise<TCreateResult>;
  update: (existing: TFetchResult) => Promise<TUpdateResult>;
};

export const upsertEntry = async <TFetchResult, TCreateResult, TUpdateResult>({
  fetchItem,
  create,
  update,
}: UpsertInput<TFetchResult, TCreateResult, TUpdateResult>): Promise<
  TCreateResult | TUpdateResult | null
> => {
  const existingItem = await fetchItem();

  if (existingItem) {
    const updatedItem = await update(existingItem);
    return updatedItem;
  } else {
    const newItem = await create();
    return newItem;
  }
};
