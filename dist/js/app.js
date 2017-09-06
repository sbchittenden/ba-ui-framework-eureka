"use strict";

(function () {
  var demoWTF = {
    init: function init() {
      this.cacheDOM();
      this.bindEvents();
    },
    cacheDOM: function cacheDOM() {
      this.wtfBtn = document.getElementById("wtf-try");
      this.component = document.getElementsByClassName("c-wtf")[0];
      this.component.style.display = "none";
    },
    bindEvents: function bindEvents() {
      this.wtfBtn.addEventListener("click", this.activateWTF.bind(this));
    },
    activateWTF: function activateWTF() {
      this.component.style.display = "block";
      dictionaryLinker.init();
    }
  };
  demoWTF.init();

  var dictionaryLinker = {
    init: function init() {
      this.cacheDOM();
      this.bindEvents();
    },
    cacheDOM: function cacheDOM() {
      this.ol = document.getElementsByClassName("c-wtf__list")[0];
      this.component = document.getElementsByClassName("c-wtf")[0];
      this.text = document.getElementsByClassName("wtf-text-container")[0];
      this.clear = document.getElementsByClassName("c-wtf__clear-all")[0];
      this.currentHeight = window.getComputedStyle(this.component).height;
    },
    bindEvents: function bindEvents() {
      this.text.addEventListener("mouseup", this.lookUp.bind(this));
      this.component.addEventListener("mouseover", this.show.bind(this));
      this.component.addEventListener("mouseleave", this.hide.bind(this));
      this.clear.addEventListener("click", this.clearIt.bind(this));
    },
    lookUp: function lookUp() {
      this.highlighted = window.getSelection();
      var str = this.highlighted.toString();
      if (str !== "") {
        term = this.highlighted.getRangeAt(0);
        window.open('https://www.merriam-webster.com/dictionary/' + term, 'lookitup');
        this.createList();
      }
    },
    createList: function createList() {
      var newLI = document.createElement('li');
      this.newHeight = "";
      newLI.innerHTML = term.toString();
      this.ol.appendChild(newLI);
      this.newHeight = window.getComputedStyle(this.component).height;
      this.component.style.webkitTransform = "translateY(" + this.newHeight + ")";
    },
    show: function show() {
      this.component.style.webkitTransform = "translateY(" + 0 + ")";
    },
    hide: function hide() {
      this.component.style.webkitTransform = "translateY(" + this.currentHeight + ")";
    },
    clearIt: function clearIt() {
      this.ol.innerHTML = "";
    }
  };
})();
'use strict';

(function () {
  var alertComponents = document.querySelectorAll('[class^="c-alert--"], .c-alert');
  var numOfAlertComponents = alertComponents.length;
  var i;

  // add event listeners
  for (i = 0; i < numOfAlertComponents; i++) {
    alertComponents[i].addEventListener('click', _removeAlert(i));
  }

  function _removeAlert(i) {
    return function (e) {
      e.preventDefault();
      // grab targeted alert component
      var targetAlert = alertComponents[i];
      // grab the close icon
      var closeIcon = targetAlert.querySelector('.c-alert__close-alert');

      // set to true if target is the close icon span, the icon itself, or any element with the data-close-alert attribute
      var closeClicked = e.target.nodeName === 'I' && e.target.parentNode.classList.contains('c-alert__close-alert') || e.target.classList.contains('c-alert__close-alert') || e.target.dataset.closeAlert ? true : false;

      if (closeClicked) {
        // closing animation
        targetAlert.classList.add('c-alert--remove');
        // after animation runs remove alert from DOM
        targetAlert.addEventListener('animationend', function () {
          targetAlert.remove();
        });
      }
    };
  }
})();
'use strict';

(function () {
  var demoBadge = document.querySelector('.c-badge-demo');
  var todoItems = document.querySelectorAll('.demo-badge__list li');
  var todoCheckboxes = document.querySelectorAll('.demo-badge__list li input');
  var closeBtns = document.querySelectorAll('.demo-badge__list li .fa');

  demoBadge.innerHTML = todoItems.length;

  function updateBadge() {
    console.log('enter func');
    var checkboxes = document.querySelectorAll('.demo-badge__list li input');
    var count = 0;
    for (var i = 0; i < checkboxes.length; i++) {
      console.log('enter loop');
      if (!checkboxes[i].checked) {
        console.log('one item checked');
        count++;
      }
    }

    if (count > 0) {
      demoBadge.innerHTML = count;
      console.log(demoBadge.innerHTML);
    } else {
      demoBadge.innerHTML = '';
    }
  }

  for (var j = 0; j < todoItems.length; j++) {
    todoCheckboxes[j].addEventListener('click', updateBadge);
    closeBtns[j].addEventListener('click', function () {
      this.parentNode.remove();
      updateBadge();
    });
  }
})();
'use strict';

/**
 * Created by Aashish on 3/4/2017.
 */

(function () {
  'use strict';

  var graphs = Array.from(document.querySelectorAll('.bar-graph'));
  var clientHeight = window.innerHeight || document.documentElement.clientHeight;

  var animateGraphLengths = function animateGraphLengths() {
    var bars = Array.from(this.querySelectorAll('.bar-graph__bar'));
    bars.forEach(function (bar) {
      bar.style.height = (bar.getAttribute('data-level') || 0) + '%';
    });
  };

  var callAnimateOnGraphs = function callAnimateOnGraphs() {
    graphs.forEach(function (graph) {
      if (graph.getBoundingClientRect().bottom <= clientHeight) {
        animateGraphLengths.call(graph);
      }
    });
  };

  // Initial check
  callAnimateOnGraphs();
  // Check on scroll
  window.addEventListener('scroll', function () {
    callAnimateOnGraphs();
  });
})();
'use strict';

(function () {

  var bookmarkListComponent = document.querySelector('.c-bookmarklet');
  var bookmarkList = bookmarkListComponent.querySelector('.c-bookmaklet__bookmark-list');
  var highlightColor = bookmarkListComponent.dataset.highlightColor;
  var clearAllBtn = bookmarkListComponent.querySelector('.c-bookmarklet__clear-all');
  var selectionPopUp = document.querySelector('.c-bookmarklet__pop-up');
  var selectionPopUpPip = selectionPopUp.querySelector('.c-bookmarklet__pop-up-pip');
  var popUpYesBtn = selectionPopUp.querySelector('.c-bookmarklet__pop-up-button--yes');
  var popUpNoBtn = selectionPopUp.querySelector('.c-bookmarklet__pop-up-button--no');
  var limitBookmarklet = document.querySelector('[data-limit-bookmarklet]');
  var keysPressed = [];
  var bookmarkId = 0;
  var alertActive = false;

  window.addEventListener('keydown', _keysDown, false);
  window.addEventListener('keyup', _keysUp, false);

  if (limitBookmarklet !== null) {
    limitBookmarklet.addEventListener('mouseup', _checkForSelection, false);
  } else {
    document.addEventListener('mouseup', _checkForSelection, false);
  }

  function _keysDown(e) {
    keysPressed[e.keyCode] = true;
    // keyboard shortcut Shift(16) + Control(17) + L(76) + M(77)
    if (keysPressed[16] && keysPressed[17] && keysPressed[76] && keysPressed[77]) {
      var selectedRange;
      var rangeContainer;

      selectedRange = window.getSelection().getRangeAt(0);
      rangeContainer = selectedRange.startContainer;
      // check for bookmarklet limiter attribute
      if (limitBookmarklet !== null) {
        // if selected range is a decendant of the limited element
        if (limitBookmarklet.contains(rangeContainer)) {
          _bookmarkSelection(selectedRange);
        }
      } else if (limitBookmarklet === null) {
        _bookmarkSelection(selectedRange);
      }
    }
  }

  function _keysUp(e) {
    keysPressed[e.keyCode] = false;
  }

  function _checkForSelection(e) {
    if (e.target !== popUpYesBtn) {
      var selection = window.getSelection();
      var selectedRange = selection.getRangeAt(0);

      if (selectedRange.startOffset !== selectedRange.endOffset && selectedRange.startContainer === selectedRange.endContainer) {
        _setPopUp(selectedRange);
      }
    }
  }

  function _setPopUp(selectedRange) {
    if (selectedRange.startOffset !== selectedRange.endOffset) {
      selectionPopUpPip.style.left = "";
      selectionPopUpPip.style.right = "";
      selectionPopUp.style.left = "";
      selectionPopUp.style.right = "";

      var range = selectedRange;
      var rangeDims = range.getClientRects();
      var pageWidth = window.innerWidth;
      var popUpTop = rangeDims[0].top + rangeDims[0].height + 10;
      var popUpLeft = rangeDims[0].left;
      var popUpRight = rangeDims[0].width;
      var pipPosition = rangeDims[0].width / 3.25;
      selectionPopUp.style.top = popUpTop + 'px';

      if (pageWidth - 200 < popUpLeft) {
        selectionPopUp.style.right = popUpRight + 'px';
        selectionPopUpPip.style.left = 35 + '%';
      } else {
        selectionPopUp.style.left = popUpLeft + 'px';
        selectionPopUpPip.style.left = pipPosition < 169 ? pipPosition + 'px' : 50 + '%';
      }

      selectionPopUp.classList.add('c-bookmarklet__pop-up--is-visible');

      popUpYesBtn.addEventListener('mousedown', _pressedYes(range), false);
      popUpNoBtn.addEventListener('click', function () {
        selectionPopUp.classList.remove('c-bookmarklet__pop-up--is-visible');
        range.collapse();
      }, false);
    }
  }

  function _pressedYes(range) {
    return function (e) {
      selectionPopUp.classList.remove('c-bookmarklet__pop-up--is-visible');
      _bookmarkSelection(range, true);
    };
  }

  function _bookmarkSelection(selectedRange, fromButton) {

    var calledFromButton = fromButton || false;
    var alertNode;
    var selectionString;
    var highlightNode;
    var highlightNodeQueryString;
    var bookmarkAnchorLink;
    var listNode;
    var closeIcon;
    var googleSearchBtn;
    var alertBackground;

    alertNode = bookmarkListComponent.parentNode;

    // create span node for text hightlighting
    highlightNode = document.createElement('span');
    highlightNode.className = 'c-bookmarklet__highlight-text';

    // sets text highlight color if specified in data-highlight-color attribute - defaults to yellow;
    if (highlightColor) {
      highlightNode.style = 'background-color: ' + highlightColor;
    }

    // if (selection.anchorNode) {
    if (selectedRange) {

      // get the range of selected text and surround it with the hightlighting span
      // selectedText = selection.getRangeAt(0);

      if (selectedRange.startContainer === selectedRange.endContainer && selectedRange.startOffset !== selectedRange.endOffset) {

        // surround selected text with hightlighting span
        selectedRange.surroundContents(highlightNode);

        // add unique id to highlighted span
        highlightNode.setAttribute('id', 'bookmarklet_' + bookmarkId);

        // create li node for widget ol
        listNode = document.createElement('li');
        listNode.className = 'c-bookmarklet__bookmark-list-item';

        // create close icon
        closeIcon = document.createElement('i');
        closeIcon.className = 'fa fa-times c-bookmarklet__close-icon';

        highlightNodeQueryString = encodeURIComponent(highlightNode.innerHTML);
        highlightNodeQueryString = highlightNodeQueryString.replace(/%20/g, '+');

        // create google search button
        googleSearchBtn = document.createElement('a');
        googleSearchBtn.classList.add('c-bookmarklet__google-button');
        googleSearchBtn.setAttribute('target', '_blank');
        googleSearchBtn.setAttribute('href', 'http://www.google.com/search?q=' + highlightNodeQueryString);
        googleSearchBtn.innerHTML = 'Google this bookmark <i class="fa fa-external-link" aria-hidden="true"></i>';

        // create anchor tag for widget li
        bookmarkAnchorLink = document.createElement('a');

        // set anchor link to bookmarklet ID
        bookmarkAnchorLink.setAttribute('href', '#' + 'bookmarklet_' + bookmarkId);

        // copy over the highlighted text
        bookmarkAnchorLink.innerHTML = highlightNode.innerHTML;

        // append anchor element and text to widget li
        listNode.appendChild(bookmarkAnchorLink);

        // append close icon to listNode
        listNode.appendChild(closeIcon);

        // append google search link
        listNode.appendChild(googleSearchBtn);

        // append li to widget ol
        bookmarkList.appendChild(listNode);

        // increment bookmarkId var
        bookmarkId += 1;

        // show the bookmarklet component
        bookmarkListComponent.classList.add('c-bookmarklet--is-visible');

        if (!calledFromButton) {
          selectionPopUp.classList.remove('c-bookmarklet__pop-up--is-visible');
        }

        selectedRange.collapse();
      } else {
        if (!calledFromButton && selectedRange.startContainer !== selectedRange.endContainer && !alertActive) {

          alertActive = true;
          // create background div and add class
          alertBackground = document.createElement('div');
          alertBackground.classList.add('c-bookmarklet__alert-background--warning');
          // create warning div and add class
          var warning = document.createElement('div');
          warning.classList.add('c-bookmarklet__alert--warning');
          // add in html and message
          warning.innerHTML = '<i class="fa fa-exclamation-triangle fa-2x" aria-hidden="true"></i><p><strong>D\'oh!</strong> Your selection can\'t be a bookmarked.</p><p><small><em>(Keep your selection within a single HTML tag)</em></small></p>' + '<span class="c-alert__close-alert">' + '<i class="fa fa-times"></i>' + '</span>';
          // add event listener for dismissing of alert
          alertNode.addEventListener('click', _dismissAlert(warning, alertBackground), false);
          // append alert div and background to document
          alertNode.appendChild(warning);
          alertNode.appendChild(alertBackground);
        }
        if (!calledFromButton && selectedRange.startOffset === selectedRange.endOffset && !alertActive) {

          alertActive = true;
          // create background div and add class
          alertBackground = document.createElement('div');
          alertBackground.classList.add('c-bookmarklet__alert-background--caution');
          // create alert div and add class
          var caution = document.createElement('div');
          caution.classList.add('c-bookmarklet__alert--caution');
          // add in html and message
          caution.innerHTML = '<i class="fa fa-meh-o fa-3x" aria-hidden="true"></i><p><strong>Oops!</strong> You didn\'t select anything to bookmark. Nothing to see here...</p>' + '<span class="c-alert__close-alert">' + '<i class="fa fa-times"></i>' + '</span>';
          // add event listener for dismissing of alert
          alertNode.addEventListener('click', _dismissAlert(caution, alertBackground), false);
          // append alert div and background to document
          alertNode.appendChild(caution);
          alertNode.appendChild(alertBackground);
        }
      }
    }

    // create remove list item listeners
    _buildClearBookmarkListItemListeners();
  } // end of _bookmarkSelection

  function _buildClearBookmarkListItemListeners() {
    var closeIcons = document.querySelectorAll('.c-bookmarklet__close-icon');
    var numOfListItems = closeIcons.length;
    var i;

    // add event listeners to close icons
    for (i = 0; i < numOfListItems; i++) {
      closeIcons[i].addEventListener('click', _removeListItem);
    }

    // add event listener to clear all button
    clearAllBtn.addEventListener('click', _clearAllBookmarks);
  } // end of _buildClearBookmarkListItemListeners

  function _removeListItem(e) {

    e.preventDefault();

    var listItem = e.target;

    _clearListItemAndNormalizeNode(listItem);
  } // end of _removeListItem function

  function _clearListItemAndNormalizeNode(listItem) {

    var listItemId = listItem.previousSibling.getAttribute('href').slice(1);
    var bookmarkedSpan = document.getElementById(listItemId);
    var spanContent = document.createTextNode(bookmarkedSpan.innerHTML);
    var spanParent = bookmarkedSpan.parentNode;

    // spanParent.removeAttribute('data-bookmark');
    spanParent.replaceChild(spanContent, bookmarkedSpan);
    spanParent.normalize();

    // closing animation on list item
    listItem.parentNode.classList.add('c-bookmarklet--remove');

    // after animation runs remove alert from DOM
    listItem.parentNode.addEventListener('animationend', function () {

      listItem.parentNode.remove();
      bookmarkList.normalize();

      // hide bookmark list if no list items are present
      if (bookmarkList.children.length === 0) {
        bookmarkListComponent.classList.remove('c-bookmarklet--is-visible');
      }
    });
  } // end of _clearListItemAndNormalizeNode

  function _clearAllBookmarks() {
    var closeIcons = Array.prototype.slice.call(document.querySelectorAll('.c-bookmarklet__close-icon'));

    closeIcons.forEach(function (listItem) {
      _clearListItemAndNormalizeNode(listItem);
    });
  } // end of _clearAllBookmarks

  function _dismissAlert(alertMessageNode, bg) {
    return function (e) {
      alertMessageNode.classList.add('c-bookmarklet__alert--is-dismissed');
      bg.classList.add('c-bookmarklet__alert-background--is-dismissed');

      alertActive = false;

      alertMessageNode.addEventListener('animationend', function () {
        alertMessageNode.remove();
        bg.remove();
      });
    };
  }
})();
"use strict";

window.onload = function () {

  var breadcrumb = {
    init: function init() {
      this.cacheDOM();
      this.bindEvent();
    },
    cacheDOM: function cacheDOM() {
      this.a = document.getElementsByClassName("c-breadcrumb__a--rbn");
    },
    bindEvent: function bindEvent() {
      for (var i = 0; i < this.a.length; i++) {
        this.a[i].addEventListener("click", this.addClass.bind(this));
      }
    },
    addClass: function addClass(e) {
      for (var i = 0; i < this.a.length; i++) {
        if (this.a[i].classList.contains("c-breadcrumb--act-col")) {
          this.a[i].classList.remove("c-breadcrumb--act-col");
        }
      }
      if (!e.target.classList.contains("c-breadcrumb--act-col")) {
        e.target.classList.add("c-breadcrumb--act-col");
      }
    }
  };

  breadcrumb.init();
};
'use strict';

(function () {
  var carousels = document.querySelectorAll('.c-carousel');
  var numOfCarousels = carousels.length;
  var i;

  // add event listeners to carousels
  for (i = 0; i < numOfCarousels; i++) {
    carousels[i].addEventListener('click', _navAction(i));
  }

  function _navAction(i) {
    return function (e) {
      e.preventDefault();
      // the current carousel
      var activeCarousel = carousels[i];
      // check to see if is a slider type
      var isSlider = activeCarousel.classList.contains('c-carousel--slider-type');
      // set boolean based off of data-thumbnail-nav attr
      var isThumbNav = activeCarousel.dataset.thumbnailNav !== undefined ? true : false;
      // set boolean based off of data-bullet-nav attribute
      var isBulletNav = activeCarousel.dataset.bulletNav !== undefined ? true : false;
      // array of slides in current carousel
      var slideArray = Array.prototype.slice.call(activeCarousel.querySelectorAll('.c-carousel__slide'));
      // length of slide array
      var slideArrayLength = slideArray.length;
      // index number of the currently displayed slide
      var currentSlide = slideArray.indexOf(activeCarousel.querySelector('.c-carousel__slide--is-selected'));
      // array of bullet nav list items
      var bulletNavArray = Array.prototype.slice.call(activeCarousel.querySelectorAll('.c-carousel__bullet-nav-item'));
      // array of thumbnail nav items
      var thumbNavArray = Array.prototype.slice.call(activeCarousel.querySelectorAll('.c-carousel__thumb-nav-item'));
      // target element of click event
      var target = e.target;

      if (target.nodeName === 'I') {
        // set target to parent of icon element when prev/next nav clicked
        target = target.parentNode;
      }

      if (target.classList.contains('c-carousel__thumb-image')) {
        // set target to parent node of thumbnail image when thumbnail is clicked
        target = target.parentNode;
      }

      // if bullet nav is clicked
      if (target.dataset.slideIndex !== undefined) {
        // get the slide index from the data-slide-index attribute
        var targetedSlide = +target.dataset.slideIndex;
        // remove selected class from all slides
        slideArray.forEach(function (slide) {
          if (slide.classList.contains('c-carousel__slide--is-selected')) {
            slide.classList.remove('c-carousel__slide--is-selected');
          }
          if (isSlider) {
            // reset slide class name
            slide.className = 'c-carousel__slide';
          }
        });
        if (isBulletNav) {
          // remove active class from all bullet nav items
          bulletNavArray.forEach(function (bullet) {
            bullet.classList.remove('c-carousel__bullet-nav-item--is-active');
          });
          // add active class to correct bullet nav item
          bulletNavArray[targetedSlide].classList.add('c-carousel__bullet-nav-item--is-active');
        }
        if (isThumbNav) {
          // remove active class from all bullet nav items
          thumbNavArray.forEach(function (thumb) {
            thumb.classList.remove('c-carousel__thumb-nav-item--is-active');
          });
          // add active class to correct bullet nav item
          thumbNavArray[targetedSlide].classList.add('c-carousel__thumb-nav-item--is-active');
        }
        // add selected class to selected slide
        slideArray[targetedSlide].classList.add('c-carousel__slide--is-selected');
        if (isSlider) {
          if (targetedSlide > currentSlide || currentSlide === slideArray.length - 1) {
            slideArray[targetedSlide].classList.add('slide--slide-next');
            slideArray[currentSlide].classList.add('slide--slide-out-left');
            slideArray[currentSlide].classList.remove('slide--slide-out-*');
          } else if (targetedSlide < currentSlide) {
            slideArray[targetedSlide].classList.add('slide--slide-prev');
            slideArray[currentSlide].classList.add('slide--slide-out-right');
            slideArray[currentSlide].classList.remove('slide--slide-out-*');
          }
        }

        // if arrow nav is clicked
      } else if (target.dataset.slideNav !== undefined) {

        // get the navigation direction from data-slide-nav attribute
        var navDirection = target.dataset.slideNav;
        // set the next slide index
        var nextIndex = currentSlide < slideArrayLength - 1 ? currentSlide + 1 : 0;
        // set the previous slide index
        var prevIndex = currentSlide > 0 ? currentSlide - 1 : slideArrayLength - 1;
        // remove selected class from all slides
        slideArray.forEach(function (slide) {
          slide.classList.remove('c-carousel__slide--is-selected');
          if (isSlider) {
            // reset slide class name
            slide.className = 'c-carousel__slide';
          }
        });
        if (isBulletNav) {
          // remove active class from all bullet nav items
          bulletNavArray.forEach(function (bullet) {
            bullet.classList.remove('c-carousel__bullet-nav-item--is-active');
          });
        }
        if (isThumbNav) {
          // remove active class from all bullet nav items
          thumbNavArray.forEach(function (thumb) {
            thumb.classList.remove('c-carousel__thumb-nav-item--is-active');
          });
        }

        // add selected class to slide and active class to bullet nav depending on navDirection
        if (navDirection === 'next') {
          slideArray[nextIndex].classList.add('c-carousel__slide--is-selected');
          if (isSlider) {
            slideArray[nextIndex].classList.add('slide--slide-next');
            slideArray[currentSlide].classList.add('slide--slide-out-left');
          }
          if (isBulletNav) {
            bulletNavArray[nextIndex].classList.add('c-carousel__bullet-nav-item--is-active');
          }
          if (isThumbNav) {
            thumbNavArray[nextIndex].classList.add('c-carousel__thumb-nav-item--is-active');
          }
        } else {
          slideArray[prevIndex].classList.add('c-carousel__slide--is-selected');
          if (isSlider) {
            slideArray[prevIndex].classList.add('slide--slide-prev');
            slideArray[currentSlide].classList.add('slide--slide-out-right');
          }
          if (isBulletNav) {
            bulletNavArray[prevIndex].classList.add('c-carousel__bullet-nav-item--is-active');
          }
          if (isThumbNav) {
            thumbNavArray[prevIndex].classList.add('c-carousel__thumb-nav-item--is-active');
          }
        }
      }
    };
  }
})();
'use strict';

(function () {
  var deleteBtns = document.querySelectorAll('.c-chip__delete');

  function deleteChip(deleteBtn) {
    deleteBtn.parentNode.remove();
  }

  for (var i = 0; i < deleteBtns.length; i++) {
    deleteBtns[i].addEventListener('click', function () {
      deleteChip(this);
    });
  }
})();
'use strict';

(function () {
  var collapseComponents = document.querySelectorAll('.c-collapse');
  var numOfCollapseComponents = collapseComponents.length;
  var i;
  // add event listeners
  for (i = 0; i < numOfCollapseComponents; i++) {
    collapseComponents[i].addEventListener('click', _toggleCollapse(i));
  }

  function _toggleCollapse(i) {
    return function (e) {
      e.preventDefault();
      // grab targeted collapse component
      var currentComponent = collapseComponents[i];
      // get fixed height if specified
      var fixedHeight = currentComponent.dataset.fixedHeight;
      // grab the content container
      var contentContainer = currentComponent.querySelector('.c-collapse__content-container');
      // check to see if the content is currently visible
      var isVisible = contentContainer.classList.contains('c-collapse__content--is-visible');
      // get the height of the components content
      var contentHeight = contentContainer.scrollHeight;
      if (e.target.classList.contains('c-collapse__toggle')) {
        if (!isVisible) {
          // toggle visible class and set height
          contentContainer.classList.toggle('c-collapse__content--is-visible');
          if (fixedHeight !== undefined) {
            contentContainer.style.height = fixedHeight + 'px';
          } else {
            contentContainer.style.height = contentHeight + 'px';
          }
        } else {
          // toggle visible class and set height
          contentContainer.classList.toggle('c-collapse__content--is-visible');
          contentContainer.style.height = 0 + 'px';
        }
      }
    };
  }
})();
'use strict';

(function () {

    /* Get all demo items from page */
    var demoItems = document.querySelectorAll('.c-tooltip-help');
    var demoItemsArray = [];

    var prevIndex = -1;
    var nextIndex = -1;

    /* Add items from nodeList into an array */
    var x;
    for (x = 0; x < demoItems.length; x++) {
        demoItemsArray.push(demoItems[x]);
    }

    /* sort Array */

    demoItemsArray.sort(function (a, b) {
        if (a.attributes['help-order'].value > b.attributes['help-order'].value) {
            return 1;
        } else {
            if (a.attributes['help-order'].value < b.attributes['help-order'].value) {
                return -1;
            } else {
                return 0;
            }
        }
    });

    var i;
    var numDemos = demoItems.length;

    /* Get dimensions of screen  */

    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    for (i = 0; i < numDemos; i++) {
        demoItems[i].innerHTML = '<span class="c-tooltip-help__message-icon"><i class="fa fa-question-circle-o" title="Click for tip." aria-hidden="true"></i></span>' + demoItems[i].innerHTML;

        /* Ensure that help message shows within the bounds of the screen */

        var helpMessage = demoItems[i].querySelector('.c-tooltip-help__message');
        var rect = helpMessage.getBoundingClientRect();
        var totalLeft = rect.left + rect.width; //get current left position of the element
        var totalTop = rect.top + rect.height; // get current top position of the element
        if (totalLeft > w) {
            // change the position if element extends the width or height of the screen
            var negativeWidth = rect.width * -1;
            helpMessage.style.left = negativeWidth + 'px';
        } /*else{
             if(totalTop > h){
                 helpMessage.style.top = rect.height * -1 + 'px';
             }
          }*/

        /* Make help message appear when clicking the help icon [closure] */

        (function () {
            var block = demoItems[i];
            var message = demoItems[i].querySelector('.c-tooltip-help__message');
            block.addEventListener('click', function () {
                message.classList.toggle('is-hidden');
            });
        })();
    }

    /* handle prev and next controls */

    var prevButtonList = document.querySelectorAll('.c-tooltip-help__controls-prev');
    var nextButtonList = document.querySelectorAll('.c-tooltip-help__controls-next');
    var j, l;
    for (j = 0; j < prevButtonList.length; j++) {

        (function () {
            prevButtonList[j].addEventListener('click', function () {
                var parent = findAncestor(this, 'c-tooltip-help');
                showPrevious(parent);
            });
        })();
    }

    for (l = 0; l < nextButtonList.length; l++) {

        (function () {
            nextButtonList[l].addEventListener('click', function () {
                var parent = findAncestor(this, 'c-tooltip-help');
                showNext(parent);
            });
        })();
    }

    /*Function used to find and ancestor node with a particular class */

    function findAncestor(el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls)) {}
        return el;
    }

    /* Show previous */
    function showPrevious(node) {
        prevIndex = demoItemsArray.indexOf(node);
        if (prevIndex > 0) {
            var message = node.querySelector('.c-tooltip-help__message');
            message.classList.remove('is-hidden');
            var previousMessage = demoItemsArray[prevIndex - 1].querySelector('.c-tooltip-help__message');
            previousMessage.classList.remove('is-hidden');
        }
    }

    /* Show next */
    function showNext(node) {
        nextIndex = demoItemsArray.indexOf(node);
        if (nextIndex > -1 && nextIndex < demoItemsArray.length - 1) {
            var message = node.querySelector('.c-tooltip-help__message');
            message.classList.remove('is-hidden');
            var nextMessage = demoItemsArray[nextIndex + 1].querySelector('.c-tooltip-help__message');
            nextMessage.classList.remove('is-hidden');
        }
    }
})();
"use strict";

/*jslint plusplus: true*/
var i; //used in loop

/*****Define dot colors******/
//no input
var dotNoInput = "#F2617A";
var dotInvalid = "#EDBE69";
var dotValid = "#31E96B";

/*****START INTERNAL VALIDATION LIBRARY*****/
//backend libraries used for validation

var validator = {};

//EMAIL
validator.isEmail = function (input) {
    //Test for valid Email address

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
        return true;
    }
    return false;
};

//Phone Numbers
validator.isPhoneNumber = function (input) {
    //remove hyphens
    input = input.split("-");
    input = input.join("");

    //Remove USA Country Code
    if (input.substring(0, 1) === "1") {
        input = input.substring(1);
    }

    //Check input is 10 digits and a number.  Report Errors if need be.
    try {
        if (input.length !== 10) {
            throw "Not a valid USA Phone Number with 10 digits";
        } else if (isNaN(input) === true) {
            throw "Not a number";
        }
    } catch (err) {
        console.log("ERROR: " + err);
        return false;
    }
    return true;
};

//check if input is a valid date
validator.isDate = function (input) {
    //convert input to string
    input = input.toString();

    var isItDate = new Date(input);
    console.log(isItDate);

    try {
        if (Number.isNaN(isItDate.getTime()) === true) {
            throw input + " is not a valid date";
        }
    } catch (err) {
        console.log("ERROR: " + err);
        return false;
    }

    return true;
};

//removes symbols from a string.  Used in the Password validator and alphanumeric validator
validator.withoutSymbols = function (input) {
    //convert input to an array
    input = input.toString();
    input = input.split("");

    //output will be input without symbols
    var output = [];

    var i; //used in loop

    //If upper and lower case are not equal (alpha check)
    //OR Is Not a Number equls false (Number Check)
    //push value to output array
    for (i = 0; i < input.length; i++) {
        if (input[i].toUpperCase() !== input[i].toLowerCase() || isNaN(input[i]) === false) {
            output.push(input[i]);
        }
    }

    //convert Array back to string
    output = output.join("");

    return output;
};

//check for strong password
validator.password = function (input) {
    //convert input to string
    input = input.toString();

    //check for minimum length of 12 characters
    if (input.length < 12) {
        return false;
    }

    //check for at least one symbol
    if (input === validator.withoutSymbols(input)) {
        return false;
    }

    return true;
};

//test inout is alphanumeric, used in username validator
validator.isAlphanumeric = function (input) {
    //checks if input is alphanumeric only

    //create newInput from input w/o symbols
    var newInput = validator.withoutSymbols(input);

    //remove whitespace from newInput
    newInput = newInput.replace(" ", "");

    if (input === newInput) {
        return true;
    }

    return false;
};

//checks username is valid
validator.username = function (input) {
    if (input.length < 5) {
        return false;
    }

    if (!validator.isAlphanumeric(input)) {
        return false;
    }

    return true;
};

//validate zipcode
validator.zipcode = function (input) {

    //check input length is not six
    //fixes edge case of five digits plus hyphen
    //with no additional digits
    if (input.length === 6) {
        return false;
    }

    //convert to string
    input = input.toString();

    //remove hyphen if present
    input = input.replace("-", "");

    //check length is 5 or 9 digits
    if (input.length !== 5 && input.length !== 9) {
        return false;
    }

    //check string is only digits
    if (Number.isNaN(input) === true) {
        return false;
    }

    return true;
};

/*****END INTERNAL VALIDATION LIBRARAY*****/

/*****validateMe sub functions- validation procedure via content type*****/

var inputCode = {};

//Email
inputCode.email = function (targ) {
    if (targ.value === "") {
        targ.nextElementSibling.style.backgroundColor = dotNoInput;
    } else if (validator.isEmail(targ.value)) {
        targ.nextElementSibling.style.backgroundColor = dotValid;
    } else {
        targ.nextElementSibling.style.backgroundColor = dotInvalid;
    }
};

//search
inputCode.search = function (targ) {
    if (targ.value === "") {
        targ.nextElementSibling.style.backgroundColor = dotNoInput;
    } else if (targ.value.length > 2) {
        targ.nextElementSibling.style.backgroundColor = dotValid;
    } else {
        targ.nextElementSibling.style.backgroundColor = dotInvalid;
    }
};

//telephone number
inputCode.tel = function (targ) {
    if (targ.value === "") {
        targ.nextElementSibling.style.backgroundColor = dotNoInput;
    } else if (validator.isPhoneNumber(targ.value)) {
        targ.nextElementSibling.style.backgroundColor = dotValid;
    } else {
        targ.nextElementSibling.style.backgroundColor = dotInvalid;
    }
};

//check input in number input is actually a number
inputCode.number = function (targ) {
    if (targ.value === "") {
        targ.nextElementSibling.style.backgroundColor = dotNoInput;
    } else if (!Number.isNaN(targ.value)) {
        targ.nextElementSibling.style.backgroundColor = dotValid;
    } else {
        targ.nextElementSibling.style.backgroundColor = dotInvalid;
    }
};

//NOTE: Once date is validated value is sent to the Age Box
//The Age Box is then validated
inputCode.date = function (targ) {

    //calculate age based on DOB and then send results to the age box
    function sendAge(DOB) {
        var today = new Date();
        var birthDate = new Date(DOB);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) {
            age--;
        }
        var ageDisplay = document.getElementById("eureka-c-dotValidator-age-id");
        console.log(age);
        ageDisplay.innerHTML = age;
        if (age < 18) {
            ageDisplay.nextElementSibling.style.backgroundColor = dotInvalid;
        } else {
            ageDisplay.nextElementSibling.style.backgroundColor = dotValid;
        }
        ageDisplay.classList.remove("eureka-c-dotValidator-age-inactive");
    }
    //check if DOB if a valid date
    if (targ.value === "") {
        targ.nextElementSibling.style.backgroundColor = dotInvalid;
    } else if (validator.isDate(targ.value)) {
        targ.nextElementSibling.style.backgroundColor = dotValid;
        sendAge(targ.value);
    } else {
        targ.nextElementSibling.style.backgroundColor = dotInvalid;
    }
};

inputCode.password = function (targ) {
    if (targ.value === "") {
        targ.nextElementSibling.style.backgroundColor = dotNoInput;
    } else if (validator.password(targ.value)) {
        targ.nextElementSibling.style.backgroundColor = dotValid;
    } else {
        targ.nextElementSibling.style.backgroundColor = dotInvalid;
    }
};

inputCode.username = function (targ) {
    if (targ.value === "") {
        targ.nextElementSibling.style.backgroundColor = dotNoInput;
    } else if (validator.username(targ.value)) {
        targ.nextElementSibling.style.backgroundColor = dotValid;
    } else {
        targ.nextElementSibling.style.backgroundColor = dotInvalid;
    }
};

inputCode.zipcode = function (targ) {
    if (targ.value === "") {
        targ.nextElementSibling.style.backgroundColor = dotNoInput;
    } else if (validator.zipcode(targ.value)) {
        targ.nextElementSibling.style.backgroundColor = dotValid;
    } else {
        targ.nextElementSibling.style.backgroundColor = dotInvalid;
    }
};

//select all inputs with dotValidator enabled
var validotMe = document.querySelectorAll("[data-dotValidator='true']");
//provides check validotMe is present.  If not, skip script.
var len = validotMe && validotMe.length || false;

//based on input type load appropriate function
function validateMe(targ) {
    if (targ.type === "search") {
        inputCode.search(targ);
    } else if (targ.type === "email") {
        inputCode.email(targ);
    } else if (targ.type === "tel") {
        inputCode.tel(targ);
    } else if (targ.type === "number") {
        inputCode.number(targ);
    } else if (targ.type === "date") {
        inputCode.date(targ);
    } else if (targ.type === "password") {
        inputCode.password(targ);
    } else if (targ.type === "text" && targ.previousElementSibling.innerHTML === "Username") {
        inputCode.username(targ);
    } else if (targ.type === "text" && targ.previousElementSibling.innerHTML === "Zipcode") {
        inputCode.zipcode(targ);
    }
}

//for loop will add event listener to inputs
//will automatically detect the appropriate event listener
//len checks that validotMe is present
//if not skip rest of script
if (len) {
    for (i = 0; i < validotMe.length; i++) {
        if (validotMe[i].type === "date") {
            validotMe[i].addEventListener("blur", function (event) {
                validateMe(this);
            });
        } else {
            validotMe[i].addEventListener("input", function (event) {
                validateMe(this);
            });
        }
    }
}
'use strict';

(function () {
  var dropDowns = document.querySelectorAll('.c-dropdown__link');
  var numOfDropDowns = dropDowns.length;
  var i;

  // add event listeners
  for (i = 0; i < numOfDropDowns; i++) {
    dropDowns[i].addEventListener('click', _toggleCollapse(i));
  }

  function _toggleCollapse(i) {
    return function (e) {
      e.preventDefault();

      // grab targeted collapse component
      var currentComponent = dropDowns[i];
      // current dropdown link width
      var parentWidth = currentComponent.getBoundingClientRect().width;
      // grab dropdown id
      var dropId = currentComponent.dataset.dropControls;
      // get fixed height if specified
      var fixedHeight = currentComponent.dataset.fixedHeight;
      // grab the content container
      var dropDownList = document.querySelector('[data-drop-id="' + dropId + '"]');
      // grab drop down list items
      var dropDownListItems = dropDownList.querySelectorAll('.c-dropdown__list-item');
      // add event listeners to list items
      for (var j = 0; j < dropDownListItems.length; j++) {
        dropDownListItems[j].onclick = _toggleList;
      }
      // set drop down list to width of parent link
      dropDownList.style.width = parentWidth + 'px';
      // check to see if the content is currently visible
      var isVisible = dropDownList.classList.contains('c-dropdown__list--is-visible');
      // get the height of the components content
      var contentHeight = dropDownList.scrollHeight;
      if (e.target.classList.contains('c-dropdown__link') || e.target.classList.contains('c-dropdown__list-item')) {
        if (!isVisible) {
          // toggle visible class and set height
          dropDownList.classList.toggle('c-dropdown__list--is-visible');
          if (fixedHeight !== undefined) {
            dropDownList.style.height = fixedHeight + 'px';
          } else {
            dropDownList.style.height = contentHeight + 'px';
          }
        } else {
          // toggle visible class and set height
          dropDownList.classList.toggle('c-dropdown__list--is-visible');
          dropDownList.style.height = 0 + 'px';
        }
      }
    };
  }

  function _toggleList() {
    this.parentNode.classList.toggle('c-dropdown__list--is-visible');
    this.parentNode.style.height = 0 + 'px';
  }
})();
"use strict";

(function () {

  var inputSwitch = {
    init: function init() {
      this.cacheDOM();
      this.bindEvents();
    },
    cacheDOM: function cacheDOM() {
      this.switch = document.getElementsByClassName("c-switch__slider")[0];
      this.checkbox = document.getElementById("c-input-switch");
    },
    bindEvents: function bindEvents() {
      this.switch.addEventListener("click", this.toggleOn.bind(this));
    },
    toggleOn: function toggleOn() {
      this.checkbox.checked = this.checkbox.checked ? false : true;
    }
  };
  inputSwitch.init();
})();
"use strict";

(function () {
  var gallery = {
    init: function init() {
      this.cacheDOM();
      this.bindEvent();
    },
    cacheDOM: function cacheDOM() {
      this.viewer = document.getElementsByClassName("c-gallery-viewer")[0];
      this.img = document.getElementsByClassName("c-gallery--clickable");
      this.gallery = document.getElementsByClassName("c-gallery")[0];
    },
    bindEvent: function bindEvent() {
      this.gallery.addEventListener("click", this.displayImg.bind(this));
      this.viewer.addEventListener("click", this.hideViewer.bind(this));
    },
    displayImg: function displayImg(e) {
      if (e.target.classList.contains("c-gallery--clickable")) {
        var style = e.target.currentStyle || window.getComputedStyle(e.target, false),
            img = style.backgroundImage.slice(4, -1);
        this.viewer.style.backgroundImage = "url(" + img + ")";
        this.viewer.style.display = "block";
      }
    },
    hideViewer: function hideViewer() {
      this.viewer.style.display = "none";
    }
  };

  gallery.init();
})();
"use strict";

window.addEventListener("load", function () {
  var herald = {
    init: function init() {
      this.cacheDOM();
      this.bindEvent();
      this.loadStyles();
    },
    cacheDOM: function cacheDOM() {
      this.component = document.getElementById("c-herald");
      this.content = document.getElementById("c-herald__content");
      this.trigger = document.getElementById("c-herald__trigger");
      this.rbn = document.getElementById("c-herald__ribbon");
      this.messageHeight = this.content.offsetHeight;
      this.pLength = document.querySelectorAll(".c-herald__message p").length;
      this.trigger.children[0].innerHTML = this.pLength;
      this.triggerValue = this.trigger.innerHTML;
    },
    bindEvent: function bindEvent() {
      this.trigger.addEventListener("click", this.announce.bind(this));
    },
    announce: function announce() {
      this.component.classList.toggle("announce");
      this.rbn.classList.toggle("lengthen");

      if (!this.component.classList.contains("announce")) {
        this.trigger.innerHTML = this.triggerValue;
      } else {
        this.trigger.innerHTML = "X";
      }
    },
    loadStyles: function loadStyles() {
      this.component.classList.remove('no-js');
      this.trigger.classList.add("clickable");
      this.content.style.webkitTransform = "translateY(-" + this.messageHeight + "px)";
    }
  };
  herald.init();
});
'use strict';

(function () {
  var notes = JSON.parse(window.sessionStorage.getItem('inline-notes'));
  var noteList = document.querySelector('.c-inline-note__list');

  function printNotes() {
    if (noteList) {
      while (noteList.lastChild) {
        noteList.removeChild(noteList.lastChild);
      }
    }
    for (var prop in notes) {
      var listItem = document.createElement('li');
      var listSelectedTxt = document.createElement('span');
      listItem.classList.add('c-list__item', 'c-list--ol__item');
      listSelectedTxt.classList.add('c-inline-note__list-selected-txt');
      listSelectedTxt.innerHTML = notes[prop].selectedText;
      listItem.appendChild(listSelectedTxt);
      listItem.innerHTML += ": " + notes[prop].note;
      noteList.appendChild(listItem);
    }
  }

  printNotes();
})();
'use strict';

(function () {
  var inlineNote = document.querySelector('.c-inline-note');
  var printBtn = document.querySelector('.c-inline-note__print-btn');
  var clearAllBtn = document.querySelector('.c-inline-note__clear-btn');
  var notes = {};
  var index = 0;
  var activeIndex;

  // Create a note and all its elements inside
  function createNote() {
    // if a user don't select anything, a note won't be created
    if (window.getSelection().rangeCount > 0) {
      var selectedRange = window.getSelection().getRangeAt(0);
      var selectedStartContainer = selectedRange.startContainer;
      if (inlineNote.contains(selectedStartContainer)) {
        if (selectedRange.startContainer === selectedRange.endContainer && selectedRange.startOffset !== selectedRange.endOffset) {
          // Add a property to notes obj. key is the index, value is
          // an obj. This obj's key is the selected text, value is
          // empty for now.
          notes[index] = {
            'selectedText': selectedRange.toString(),
            'note': ''
          };

          // Create and add elements to a note
          var highlight = document.createElement('span');
          var noteWrap = document.createElement('span');
          var note = document.createElement('textarea');
          var rmBtn = document.createElement('span');
          highlight.className = 'c-inline-note__highlight';
          highlight.setAttribute('id', 'hl' + index);
          noteWrap.className = 'c-inline-note__note-wrap';
          noteWrap.style.display = 'flex';
          noteWrap.setAttribute('id', 'nWrap' + index);
          note.setAttribute('id', 'note' + index);
          rmBtn.className = 'c-inline-note__remove-btn';
          rmBtn.innerHTML = 'remove';
          noteWrap.appendChild(note);
          noteWrap.appendChild(rmBtn);
          // highlight the selected text
          selectedRange.surroundContents(highlight);
          highlight.appendChild(noteWrap);

          activeIndex = index;
          index++;

          // add openNote function to highlighted span
          highlight.addEventListener('click', function (e) {
            // prevent click event propagates to body and closes the note area
            e.stopPropagation();
            openNote(this);
          });

          // add removeNote function to rmBtn
          rmBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            removeNote();
          });

          // stop propagation of noteWrap
          noteWrap.addEventListener('click', function (e) {
            e.stopPropagation();
          });

          // place the note
          placeNote(selectedRange, activeIndex);
        } else {
          // * Originally from bookmarklet.js *
          var alertNumber = document.querySelectorAll('.c-bookmarklet__alert--warning').length;
          if (alertNumber === 0) {
            // create background div and add class
            var alertBackground = document.createElement('div');
            alertBackground.classList.add('c-bookmarklet__alert-background--warning');
            // create warning div and add class
            var warning = document.createElement('div');
            warning.classList.add('c-bookmarklet__alert--warning');
            // add in html and message
            warning.innerHTML = '<i class="fa fa-exclamation-triangle fa-2x" aria-hidden="true"></i><p><strong>D\'oh!</strong> Cannot add note to selected section.</p><p><small><em>(Keep your selection within a single HTML tag)</em></small></p>' + '<span class="c-alert__close-alert">' + '<i class="fa fa-times"></i>' + '</span>';
            // append alert div and background to body
            document.body.appendChild(warning);
            document.body.appendChild(alertBackground);

            // add event listener for dismissing of alert
            alertBackground.addEventListener('click', function () {
              dismissAlert(warning, this);
            });
            warning.addEventListener('click', function () {
              dismissAlert(this, alertBackground);
            });
          }
        }
      }
    }
  }

  function placeNote(ele, i) {
    if (i === undefined) return;

    // get position of selectedRange and dimension of noteWrap
    var bodyWidth = document.body.clientWidth;
    var selectedTop = ele.getClientRects()[0].top;
    var selectedLeft = ele.getClientRects()[0].left;
    var selectedHeight = ele.getClientRects()[0].height;
    var activeNWrap = document.getElementById('nWrap' + i);

    // set noteWrap position based on selectedRange's position
    // Goes to top or bottom
    if (selectedTop < 170) {
      // 170 = height of noteWrap + margin to selected\
      activeNWrap.style.top = selectedHeight + 12 + 'px';
    } else {
      console.log('else');
      activeNWrap.style.top = -120 + 'px';
      // 120 = height of noteWrap + margin to selected
    }

    // Aligns left or right
    if (selectedLeft + 190 >= bodyWidth) {
      //align right
      activeNWrap.style.right = 0;
      activeNWrap.style.left = 'auto';
    } else {
      //align left
      activeNWrap.style.left = 0;
    }
  }

  function openNote(highlighted) {
    closeNote(); // close opened note
    var highlightId = highlighted.getAttribute('id');
    var i = highlightId.slice(2);
    if (i === '' + activeIndex) return;

    var activeNWrap = document.getElementById('nWrap' + i);
    activeNWrap.style.display = 'flex';

    placeNote(highlighted, i);

    activeIndex = i;
  }

  function closeNote() {
    // if no note is opened, return
    if (activeIndex === undefined) return;

    var activeNWrap = document.getElementById('nWrap' + activeIndex);
    var activeNote = document.getElementById('note' + activeIndex);
    activeNWrap.style.display = 'none';
    // update note key value in notes obj
    notes[activeIndex].note = activeNote.value;
    activeIndex = undefined;
  }

  function remove(index) {
    var highlighted = document.getElementById('hl' + index);
    var p = highlighted.parentNode;
    // highlighted.replaceWith(notes[activeIndex].selectedText);
    p.replaceChild(document.createTextNode(notes[index].selectedText), highlighted);
    delete notes[index];
    p.normalize();
  }

  // remove one note
  function removeNote() {
    if (activeIndex === undefined) return;

    remove(activeIndex);
    activeIndex = undefined;
  }

  // remove all notes
  function clearAllNotes() {
    for (var prop in notes) {
      remove(prop);
    }
  }

  function printNotes() {
    window.sessionStorage.setItem('inline-notes', JSON.stringify(notes));
    window.open('jr-components/inline-note-print.html', '_blank');
  }

  function dismissAlert(alert, bg) {
    alert.classList.add('c-bookmarklet__alert--is-dismissed');
    bg.classList.add('c-bookmarklet__alert-background--is-dismissed');

    alert.addEventListener('animationend', function () {
      alert.remove();
      bg.remove();
    });
  }

  window.addEventListener('resize', function () {
    var highlighted = document.getElementById('hl' + activeIndex);
    placeNote(highlighted, activeIndex);
  });

  document.body.addEventListener('click', closeNote);

  document.addEventListener('keydown', function (e) {
    // If shift, control and number 0 keys are all pressed down, create a note
    if (e.keyCode === 48 && e.shiftKey && e.ctrlKey) {
      closeNote();
      createNote();
    }
  });

  printBtn.addEventListener('click', printNotes);
  clearAllBtn.addEventListener('click', clearAllNotes);
})();
/**
 * Created by Aashish on 3/1/2017.
 */
/*var loader = (function () {
  'use strict';

  var show = function (id) {
    var loaderElement = document.getElementById(id) || document.querySelector('.loader');
    loaderElement.classList.remove('loader-overlay--hidden');
    loaderElement.classList.add('loader-overlay--visible');
    loaderElement.parentNode.classList.remove('loader-parent--scroll-show');
    loaderElement.parentNode.classList.add('loader-parent--scroll-hide');
  };

  var hide = function (id) {
    var loaderElement = document.getElementById(id) || document.querySelector('.loader');
    loaderElement.classList.remove('loader-overlay--visible');
    loaderElement.classList.add('loader-overlay--hidden');
    loaderElement.parentNode.classList.remove('loader-parent--scroll-hide');
    loaderElement.parentNode.classList.add('loader-parent--scroll-show');
  };

  var toggle = function (id) {
    var loaderElement = document.getElementById(id) || document.querySelector('.loader');
    loaderElement.classList.toggle('loader-overlay--visible');
    loaderElement.classList.toggle('loader-overlay--hidden');
    loaderElement.parentNode.classList.toggle('loader-parent--scroll-show');
    loaderElement.parentNode.classList.toggle('loader-parent--scroll-hide');
  };

  var init = function (id) {
    loader.show(id);
    loader.hide(id);
  };

  return {
    init: init,
    show: show,
    hide: hide,
    toggle: toggle
  };
})();*/
"use strict";
'use strict';

(function () {
  var modalTriggers = document.querySelectorAll('.c-modal-trigger');
  var modalTriggersArr = [].slice.call(modalTriggers);
  var fullModalTrigger = document.querySelector('.c-modal-trigger--f');
  var closeBtns = document.querySelectorAll('.c-modal__close');
  var closeBtnsArr = [].slice.call(closeBtns);
  var overlay = document.querySelector('.c-modal-overlay');
  var activeModal;
  var transitionClass;
  var overlayClass;
  var i;

  function closeModal() {
    activeModal.classList.remove(transitionClass);
    overlay.classList.remove(overlayClass);
    overlay.style.visibility = 'hidden';
  }

  function addOverlayHandler() {
    overlay.addEventListener('click', closeModal);
  }

  function addCloseHandler(closeBtn) {
    closeBtn.addEventListener('click', function () {
      closeModal();
    });
  }

  function addTriggerHandler(trigger) {
    var index = modalTriggersArr.indexOf(trigger);

    trigger.addEventListener('click', function () {
      if (index == 1) {
        overlayClass = 'c-modal-overlay--full';
      } else {
        overlayClass = 'c-modal-overlay--gray';
      }
      activeModal = document.getElementById(this.getAttribute('href').slice(1));
      transitionClass = 'c-modal-transition--' + index;
      activeModal.classList.add(transitionClass);
      overlay.classList.add(overlayClass);
      overlay.style.visibility = 'visible';
    });
  }

  for (i = 0; i < modalTriggers.length; i++) {
    addTriggerHandler(modalTriggers[i]);
  }

  for (i = 0; i < closeBtns.length; i++) {
    addCloseHandler(closeBtns[i]);
  }

  addOverlayHandler();
})();
"use strict";

(function () {
  var progressToggler = {
    init: function init() {
      this.cacheDOM();
      this.bindEvent();
    },
    cacheDOM: function cacheDOM() {
      this.pBtn = document.getElementsByClassName("c-progress-toggler")[0];
      this.pBar = document.querySelector("[data-animProgress='false']");
    },
    bindEvent: function bindEvent() {
      this.pBtn.addEventListener("click", this.toggleIt.bind(this));
    },
    toggleIt: function toggleIt() {

      this.pBar.classList.toggle("progress-animate");
      if (this.pBar.dataset.animprogress === "false") {
        this.pBar.dataset.animprogress = "true";
      } else {
        this.pBar.dataset.animprogress = "false";
      }
    }
  };
  progressToggler.init();
})();
'use strict';

/**
 * Created by Aashish on 2/25/2017.
 */
(function () {
  'use strict';

  var fetchScrollToTargets = function fetchScrollToTargets() {
    // Fetch navigation list and the anchor tags within it to form the scrollspy checkpoints
    var nav = document.querySelector('[data-scrollspy]');
    var links = nav.querySelectorAll('a[href]:not([href="#"]');
    var targets = [],
        testTargets = {};

    // Create the target checkpoints array.
    Array.prototype.forEach.call(links, function (element) {
      var domTarget = document.getElementById(element.hash.slice(1));
      targets.push({
        navItem: element.parentNode, // this is used to mark the active nav item
        top: window.pageYOffset + domTarget.getBoundingClientRect().top, // this will become the start bound condition for
        // active nav item
        bottom: window.pageYOffset + domTarget.getBoundingClientRect().bottom // this will become the end bound condition for active nav item
      });

      // Add a click event listener on each nav__item
      element.parentNode.addEventListener('click', function () {
        this.classList.add('nav__item--active');
      });
    });

    return {
      nav: nav,
      targets: targets
    };
  };

  var scrollspyNav = function scrollspyNav(scrollspyObj) {
    // read current scroll position
    var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

    for (var i = 0; i < scrollspyObj.targets.length; i++) {
      var checkTarget = scrollspyObj.targets[i];
      var navItem = checkTarget.navItem;
      if (scrollPosition >= checkTarget.top && scrollPosition <= checkTarget.bottom) {
        // activate item
        navItem.classList.add('nav__item--active');
      } else {
        navItem.classList.remove('nav__item--active'); //deactivate item
      }
    }
  };

  window.addEventListener('load', function () {
    var scrollspyObject = fetchScrollToTargets();
    window.addEventListener('scroll', function () {
      scrollspyNav(scrollspyObject);
    });
  });
})();
/**
 * Created by Aashish on 2/25/2017.
 */
/*(function () {
  'use strict';
  // Fetch scrollspy nav, progressbar within it and the label
  // these three will get modified based on the scroll position
  var scrollspy = document.querySelector('.scrollspy[data-spy-on]');
  var progressBar = scrollspy.querySelector('.c-progressbar__meter');
  var label = progressBar.querySelector('.c-progress__label');

  // Fetch the content on which the scrollspy would work
  var contentId = scrollspy.getAttribute('data-spy-on');
  var content = document.getElementById(contentId);

  // initial boundary values
  var clientHeight = window.innerHeight;
  var initialOffset = scrollspy.offsetTop;
  progressBar.style.width = '0%';

  var scrollspyProgress = function () {
    // read current scroll position
    var scrollPosition = (document.documentElement.scrollTop || document.body.scrollTop);

    // make the scrollspy progress bar sticky
    if (initialOffset > scrollPosition) {
      scrollspy.classList.remove('scrollspy--sticky');
    }
    else {
      scrollspy.classList.add('scrollspy--sticky');
    }

    // Calculate the percentage completion for scrollspy
    var scrollableHeight = content.getBoundingClientRect().height - clientHeight;
    var percentageCompleted = (((scrollPosition - initialOffset) * 100) / scrollableHeight).toFixed(0);

    // Round to nearest hundred in case the calculated value go outside bounds
    // This can happen as the dom elements are moved in and out of the bounding box (the window)
    if (percentageCompleted < 0)
      percentageCompleted = 0;
    else if (percentageCompleted > 100)
      percentageCompleted = 100;

    // Set the values
    progressBar.style.width = percentageCompleted + '%';
    progressBar.setAttribute('aria-valuenow', percentageCompleted);
    label.innerHTML = percentageCompleted == 0 ? '' : percentageCompleted + '%';
  };

  window.addEventListener('load', function () {
    window.addEventListener('scroll', scrollspyProgress);
  });

})();*/
"use strict";
/*
//grab showcase preview
var showcaseContainer = document.querySelector(".eureka-showcase-container");

showcaseContainer.addEventListener("click", function (event) {

    var clicked = event.target;
    var showcase = document.getElementsByClassName("eureka-showcase");
    //if user clicked on a preview image, display the showcase with that image.
    if (clicked.classList.contains('eureka-showcase-preview-img')) {
        var viewImage = document.getElementsByClassName("eureka-showcase-img");
        viewImage[0].src = clicked.src;
        //add filter class based on html attribute
        viewImage[0].className = "eureka-showcase-img "+"showcase-filter-" + clicked.getAttribute("data-showcase-filter");
        showcase[0].style.display="flex";
    } else {
        showcase[0].style.display="none";
    }

});*/
"use strict";
'use strict';

(function () {
  var nextBtns = document.querySelectorAll('.c-sif__btn--next');
  var nextBtnsArr = [].slice.call(nextBtns);
  var prevBtns = document.querySelectorAll('.c-sif__btn--prev');
  var prevBtnsArr = [].slice.call(prevBtns);
  var indicators = document.querySelectorAll('.c-sif__indicator');
  var inputWraps = document.querySelectorAll('.c-sif__input-wrap');
  var labels = document.querySelectorAll('.c-sif__label');
  var inputFields = document.querySelectorAll('.c-sif__input');
  var inputFieldsArr = [].slice.call(inputFields);
  var validator = {};
  var i;

  validator.isTrimmed = function (input) {
    var arr;
    if (!input) return false;
    if (typeof input !== 'string') return false;

    arr = input.split(' ');
    for (i = 0; i < arr.length; i++) {
      if (arr[i] === '') return false;
    }
    return true;
  };

  validator.isNotEmpty = function (input) {
    if (validator.isTrimmed(input)) {
      if (input !== '') {
        return true;
      }
    }
    return false;
  };

  // Email validation
  validator.isEmail = function (email) {
    var local, domain, localSplit, domainSplit;

    if (!email) return false;
    if (email.indexOf(' ') !== -1) return false;

    if (email.indexOf('@') === -1 || email.indexOf('@') !== email.lastIndexOf('@')) return false;

    local = email.split('@')[0];
    domain = email.split('@')[1];
    localSplit = local.split('.');
    domainSplit = domain.split('.');

    if (local === '') return false;
    for (var i = 0; i < localSplit.length; i++) {
      if (localSplit[i] === '') return false;
    }

    if (domain === '') return false;
    if (domain.indexOf('_') !== -1) return false;
    if (domain.indexOf("-") === 0 || domain.lastIndexOf('-') === domain.length - 1) return false;
    if (domainSplit.length < 2) return false;
    for (i = 0; i < domainSplit.length; i++) {
      if (domainSplit[i] === '') return false;
      if (domainSplit[domainSplit.length - 1].length < 2) return false;
    }
    return true;
  };

  function showPlaceholderOrNot(input) {
    var index = inputFieldsArr.indexOf(input);

    input.addEventListener('blur', function (e) {
      e.preventDefault();
      if (input.value === '') {
        labels[index].style.opacity = 1;
        labels[index].style.visibility = 'visible';
      }
    });

    input.addEventListener('focus', function (e) {
      e.preventDefault();
      if (input.value === '') {
        labels[index].style.opacity = 0;
        labels[index].style.visibility = 'hidden';
      }
    });
  }

  function goNext(btn) {
    var index = nextBtnsArr.indexOf(btn);

    btn.addEventListener('click', function (e) {
      e.preventDefault();

      if (!validator.isNotEmpty(inputFields[index].value)) {
        nextBtns[index].style.color = 'red';
      } else if (index == 1 && !validator.isEmail(inputFields[index].value)) {
        nextBtns[index].style.color = 'red';
      } else {
        this.style.color = '#51D0EF';
        indicators[index].style.animationName = 'fadeOutRight';
        nextBtns[index].style.animationName = 'fadeOut';
        labels[index].style.animationName = 'fadeOut';
        inputFields[index].style.animationName = 'fadeOut';
        inputWraps[index + 1].style.animationName = 'fadeOut';
        inputWraps[index].classList.add('c-sif-active');
      }
    });
  }

  function addListenerToBtns() {
    for (i = 0; i < nextBtns.length; i++) {
      goNext(nextBtns[i]);
      showPlaceholderOrNot(inputFields[i]);
    }

    for (i = 0; i < prevBtns.length; i++) {
      goBack(prevBtns[i]);
    }
  }

  function goBack(btn) {
    var index = prevBtnsArr.indexOf(btn);

    btn.addEventListener('click', function () {
      inputWraps[index + 1].classList.remove('c-sif-active');
      inputWraps[index + 2].classList.add('c-sif-active');
      inputWraps[index + 2].style.animationName = 'fadeIn';
      indicators[index + 1].style.animationName = 'fadeInLeft';
      nextBtns[index + 1].style.animationName = 'fadeIn';
      labels[index + 1].style.animationName = 'fadeIn';
      inputFields[index + 1].style.animationName = 'fadeIn';

      if (index < prevBtns.length - 1) {
        prevBtns[index + 1].style.animationName = 'fadeIn';
      }
    });
  }

  addListenerToBtns();
})();
'use strict';

(function () {
    var stepperItems = document.querySelectorAll('.stepper__number');
    var nextStepButtons = document.querySelectorAll('.stepper__continue');
    /*console.log(stepperItems[0]);*/
    for (var i = 0; i < nextStepButtons.length; i++) {
        nextStepButtons[i].addEventListener('click', function () {
            stepperItems[i].classList.remove('stepper__step--active');
            stepperItems[0].classList.add('stepper__step--complete');
        });
    }

    /*function findAncestor (el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el;
    }*/
})();
'use strict';

/**
 * Created by Aashish on 2/25/2017.
 */
(function () {
  'use strict';

  var fetchStickyNavBoundaries = function fetchStickyNavBoundaries() {

    var getPosition = function getPosition(element, dimension) {
      return window.pageYOffset + element.getBoundingClientRect()[dimension];
    };

    // fetch the navigation element (can be any element, list or not)
    // must have data-nav-type="sticky"
    var nav = document.querySelector('[data-nav-type="sticky"]');
    if (nav !== null) {
      // Fetch header element using header id
      // get bottom of header to set starting boundary or fallback to Nav element's top

      // fetch the element on which the this navigation spies on.
      // The element may not be present, then fallback to body element
      var scrollContent = document.getElementById(nav.getAttribute('data-content-id')) || document.documentElement || document.body;

      var siteHeader = document.getElementById(nav.getAttribute('data-header-id')); // Header Element
      var initialPosition = siteHeader ? getPosition(siteHeader, 'bottom') : getPosition(scrollContent, 'top');

      // Fetch footer element using footer id
      // get top of footer to set ending boundary or fallback to scrollContent's bottom
      var siteFooter = document.getElementById(nav.getAttribute('data-footer-id'));
      var finalPosition = siteFooter ? getPosition(siteFooter, 'top') : getPosition(scrollContent, 'bottom');

      return {
        nav: nav,
        start: initialPosition,
        end: finalPosition - window.innerHeight
      };
    }
  };

  var stickyNav = function stickyNav(boundaries) {
    // read current scroll position
    var scrollPosition = window.pageYOffset;

    // test scroll position against starting and ending boundaries and add or remove sticky nature
    if (scrollPosition < boundaries.start) {
      boundaries.nav.classList.remove('nav--sticky');
    } else if (scrollPosition > boundaries.end) {
      // this expects that the `nav--sticky` is already added by the `else` tag below
      boundaries.nav.style.top = 'auto';
      boundaries.nav.style.bottom = scrollPosition - boundaries.end + 'px';
    } else {
      boundaries.nav.classList.add('nav--sticky');
      boundaries.nav.style.top = 0;
      boundaries.nav.style.bottom = 'auto';
    }
  };

  window.addEventListener('load', function () {
    var stickyBoundaries = fetchStickyNavBoundaries();
    window.addEventListener('scroll', function () {
      stickyNav(stickyBoundaries);
    });
  });
})();
'use strict';

/**
 * Created by Aashish on 2/26/2017.
 */
(function () {
  'use strict';

  var containers = Array.from(document.querySelectorAll('.tabs'));

  if (containers !== null && containers.length > 0) {
    containers.forEach(function (container) {

      var tabsArr = Array.from(container.querySelectorAll('.tabs__tab'));
      var panesArr = Array.from(container.querySelectorAll('.tabs__pane'));
      if (tabsArr !== null && tabsArr.length > 0) {

        tabsArr.forEach(function (tab, index) {
          tab.addEventListener('click', function () {
            tabsArr.forEach(function (element) {
              element.classList.remove('tabs__tab--active');
            });
            panesArr.forEach(function (element) {
              element.classList.remove('tabs__pane--active');
            });

            tab.classList.add('tabs__tab--active');
            panesArr[index].classList.add('tabs__pane--active');
          });
        });
      }
    });
  }
})();
"use strict";

(function () {
  var dictionaryLinker = {
    init: function init() {
      this.cacheDOM();
      this.bindEvents();
    },
    cacheDOM: function cacheDOM() {
      this.ol = document.getElementsByClassName("c-wtf__list")[0];
      this.component = document.getElementsByClassName("c-wtf")[0];
      this.text = document.getElementsByClassName("wtf-text-container")[0];
      this.clear = document.getElementsByClassName("c-wtf__clear-all")[0];
      this.currentHeight = window.getComputedStyle(this.component).height;
    },
    bindEvents: function bindEvents() {
      this.text.addEventListener("mouseup", this.lookUp.bind(this));
      this.component.addEventListener("mouseover", this.show.bind(this));
      this.component.addEventListener("mouseleave", this.hide.bind(this));
      this.clear.addEventListener("click", this.clearIt.bind(this));
    },
    lookUp: function lookUp() {
      this.highlighted = window.getSelection();
      var str = this.highlighted.toString();
      if (str !== "") {
        term = this.highlighted.getRangeAt(0);
        window.open('https://www.merriam-webster.com/dictionary/' + term, 'lookitup');
        this.createList();
      }
    },
    createList: function createList() {
      var newLI = document.createElement('li');
      this.newHeight = "";
      newLI.innerHTML = term.toString();
      this.ol.appendChild(newLI);
      this.newHeight = window.getComputedStyle(this.component).height;
      this.component.style.webkitTransform = "translateY(" + this.newHeight + ")";
    },
    show: function show() {
      this.component.style.webkitTransform = "translateY(" + 0 + ")";
    },
    hide: function hide() {
      this.component.style.webkitTransform = "translateY(" + this.currentHeight + ")";
    },
    clearIt: function clearIt() {
      this.ol.innerHTML = "";
    }
  };
  dictionaryLinker.init();
})();