/**
 * Function returning an array of potential function text signatures matching the hex signature
 * By looking it up on 4byte.directory
 */
export const lookupSignature = async (
  hexSignature: string,
): Promise<string[]> => {
  const potentialSignatures: string[] = [];

  let response: Response;
  let data: Record<string, any>;
  let page: number = 1;

  do {
    response = await fetch(
      `https://www.4byte.directory/api/v1/signatures/?hex_signature=${hexSignature}&page=${page}`,
    );

    data = await response.json();
    if (Array.isArray(data.results)) {
      potentialSignatures.push(
        ...data.results.map((result) => result.text_signature),
      );
    }
    page += 1;
  } while (data.next !== null);

  return potentialSignatures;
};
