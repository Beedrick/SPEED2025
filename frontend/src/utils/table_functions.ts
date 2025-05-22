export function sortData<T>(
    tableData: T[],
    sortKey: keyof T,
    reverse: boolean
): T[] {
    const sortedData = tableData.sort((a, b) => {
        return a[sortKey] > b[sortKey] ? 1 : -1;
    });
    if (reverse) {
        return sortedData.reverse();
    }
    return sortedData;
}