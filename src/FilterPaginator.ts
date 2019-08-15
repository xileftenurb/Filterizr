import Filterizr from "./Filterizr";


export default class FilterPaginator {
    private filterizr: Filterizr;
    private selector: string;

    private paginatorTextElements : NodeListOf<HTMLElement>;
    public constructor(filterizr: Filterizr, selector: string = '') {
        this.filterizr = filterizr;
        this.selector = selector;
        
        this.paginatorTextElements = document.querySelectorAll(`${selector}[data-pagination-text]`);
        this.paginatorTextElements.forEach(elem => {
        elem.addEventListener("pageChange", () => {
            const template = elem.getAttribute("data-pagination-text");
            elem.innerText = expandTemplate(template, this.getPaginationInformation());
        });
        })
    }
}