export function showingGridRange( paginationProps, tag){
    let {activePage, pageSize, totalrecords } = paginationProps;
    let showing = ((parseInt(activePage)-1) * parseInt(pageSize)) + 1;
    let end = (parseInt(activePage) * parseInt(pageSize)) > totalrecords ? totalrecords : parseInt(activePage) * parseInt(pageSize);
    return `Showing ${showing} to ${end} of ${totalrecords} ${tag}`;
}