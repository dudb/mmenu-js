import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import * as DOM from '../../_modules/dom';
import * as sr from '../../_modules/screenreader';

export default function (this: Mmenu, navbar: HTMLElement) {
    //	Add content to the navbar.
    let title = DOM.create('a.mm-navbar__title');
    let titleText = DOM.create('span');

    title.append(titleText);
    navbar.append(title);

    //	Update the title to the opened panel.
    var _url, _txt;
    var original: HTMLElement;

    this.bind('openPanel:before', (panel: HTMLElement) => {
        //	Do nothing in a vertically expanding panel.
        if (panel.parentElement.matches('.mm-listitem--vertical')) {
            return;
        }

        //	Find the original title in the opened panel.
        original = panel.querySelector(
            '.' + this.conf.classNames.navbars.panelTitle
        );
        if (!original) {
            original = panel.querySelector('.mm-navbar__title span');
        }

        //	Get the URL for the title.
        _url =
            original && original.closest('a')
                ? original.closest('a').getAttribute('href')
                : '';

        if (_url) {
            title.setAttribute('href', _url);
        } else {
            title.removeAttribute('href');
        }

        //	Get the text for the title.
        _txt = original ? original.innerHTML : '';
        titleText.innerHTML = _txt;
    });

    //	Add screenreader / aria support
    var prev: HTMLElement;

    this.bind('openPanel:before:sr-aria', (panel: HTMLElement) => {
        if (this.opts.screenReader.text) {
            if (!prev) {
                var navbars = DOM.children(
                    this.node.menu,
                    '.mm-navbars--top, .mm-navbars--bottom'
                );
                navbars.forEach((navbar) => {
                    let btn = DOM.find(navbar, '.mm-btn--prev')[0];
                    if (btn) {
                        prev = btn as HTMLElement;
                    }
                });
            }

            if (prev) {
                var hidden = true;
                if (this.opts.navbar.titleLink == 'parent') {
                    hidden = !prev.matches('.mm-hidden');
                }
                sr.aria(title, 'hidden', hidden);
            }
        }
    });
}
