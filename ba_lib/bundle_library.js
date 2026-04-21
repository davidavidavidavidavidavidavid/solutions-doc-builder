(globalThis["webpackChunkba"] = globalThis["webpackChunkba"] || []).push([["library"],{

/***/ "./src/core/view/PartialProgressCircle.jsx"
/*!*************************************************!*\
  !*** ./src/core/view/PartialProgressCircle.jsx ***!
  \*************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var TempCanvas = __webpack_require__(/*! ../util/TempCanvas.js */ "./src/core/util/TempCanvas.js");
var CanvasUtil = __webpack_require__(/*! ../util/CanvasUtil.js */ "./src/core/util/CanvasUtil.js");
var CanvasView = __webpack_require__(/*! ./Canvas.jsx */ "./src/core/view/Canvas.jsx");
var MeasuredEl = __webpack_require__(/*! ./MeasuredEl.jsx */ "./src/core/view/MeasuredEl.jsx");
var colors = (__webpack_require__(/*! ../util/ColorUtil.js */ "./src/core/util/ColorUtil.js").getCurrentScheme)();
module.exports = createReactClass({
  displayName: "PartialProgressCircle",
  propTypes: {
    //The size in pixels specifying the width/height that this progress icon should be.
    //If not specified, the progress icon will size itself using a MeasuredEl.
    size: PT.number,
    opaque: PT.bool,
    className: PT.string,
    percentComplete: PT.number.isRequired,
    isOffice: PT.bool,
    // Optional, only if some of the work should show up in
    // less bright color as it was completed previously
    previousPercentComplete: PT.number,
    backgroundColor: PT.string,
    allowZero: PT.bool // Allow 0 percent complete, no progress
  },
  getInitialState: function getInitialState() {
    return {
      canvas: TempCanvas.requestCanvas()
    };
  },
  componentWillUnmount: function componentWillUnmount() {
    TempCanvas.releaseCanvas(this.state.canvas);
  },
  drawOfficeProgressCircle: function drawOfficeProgressCircle(context) {
    //Always show at least a sliver of progress.
    var minPC = this.props.allowZero ? 0 : 0.05;
    var percentComplete = Math.max(this.props.percentComplete, minPC);
    var cX = Math.floor(context.getWidth() / 2);
    var cY = Math.floor(context.getHeight() / 2);
    var r = Math.min(cX, cY);
    context.save();
    context.clearRect(0, 0, context.getWidth(), context.getHeight());
    var angle = 2 * Math.PI * percentComplete;
    var start = 3 * Math.PI / 2;
    var bgFill = this.props.opaque ? colors.lighterGrayFill : colors.white;
    if (this.props.backgroundColor) {
      bgFill = this.props.backgroundColor;
    }
    context.bp().M(cX, cY).arc(cX, cY, r, start, start + angle).fill(colors.partialProgressFillOffice);
    context.bp().M(cX, cY).arc(cX, cY, r, start + angle, start + 2 * Math.PI).fill(bgFill);
    context.restore();
  },
  drawProgressCircle: function drawProgressCircle(context) {
    var cX = Math.floor(context.getWidth() / 2);
    var cY = Math.floor(context.getHeight() / 2);
    var r = Math.min(cX, cY);
    context.save();
    context.clearRect(0, 0, context.getWidth(), context.getHeight());

    // Fill in the gray background first
    var backgroundColor = "rgba(255,255,255,0.6)";
    if (this.props.opaque) {
      backgroundColor = "#DDDDDD";
    }
    context.bp().M(cX, cY).arc(cX, cY, r, 0, 2 * Math.PI).fill(backgroundColor);
    // Then the completed part
    var startAngle = -0.5 * Math.PI;
    // Always show at least a sliver of progress.
    var percentComplete = Math.max(this.props.percentComplete, 0.05);
    var endAngle = startAngle + 2 * Math.PI * Math.min(percentComplete, 1);
    context.bp().M(cX, cY).L(cX, cY - r).arc(cX, cY, r, startAngle, endAngle).Z().fill(colors.partialProgressFill);
    // Then previously completed work, if previousPercentComplete specified
    if (this.props.previousPercentComplete) {
      // Always make this at least 0.05 less than percentComplete
      // so there is a sliver of current progress
      var prevPercentComplete = Math.min(this.props.previousPercentComplete, percentComplete - 0.05);
      endAngle = startAngle + 2 * Math.PI * Math.max(Math.min(prevPercentComplete, 1), 0);
      context.bp().M(cX, cY).L(cX, cY - r).arc(cX, cY, r, startAngle, endAngle).Z().fill(colors.partialProgressPreviousFill);
    }
    // Now turning the circle into the wonky polygon using points for the outside vertices
    var shapePoints = [[33, 7.5], [20.6, 2.1], [6.3, 8.6], [1.4, 19.9], [6.4, 34.1], [20.9, 37.5], [35.4, 30.3], [38.6, 18.3]];
    var shapeScale = 2 * r / 40;
    // Making what will become the top of the wonky polygon lighter
    context.lineCap = "round";
    context.bp().M(cX - r + shapePoints[0][0] * shapeScale, cY - r + shapePoints[0][1] * shapeScale);
    for (var i = 1; i <= 3; i++) {
      context.L(cX - r + shapePoints[i][0] * shapeScale, cY - r + shapePoints[i][1] * shapeScale);
    }
    context.stroke("rgba(255,255,255,0.5)", r / 8);
    // Clipping leads to very pixelated edges,
    // so we emulate it using globalCompositeOperation
    // destination-in and another canvas
    var tempClipCanvas = TempCanvas.requestCanvas(cX * 2, cY * 2);
    CanvasUtil.setCanvasDPI(tempClipCanvas);
    var tempCtx = CanvasUtil.getShortvas(tempClipCanvas);
    //Drawing a wonky shape on that canvasx
    tempCtx.bp().M(cX - r + shapePoints[0][0] * shapeScale, cY - r + shapePoints[0][1] * shapeScale);
    for (var _i = 1; _i < 8; _i++) {
      tempCtx.L(cX - r + shapePoints[_i][0] * shapeScale, cY - r + shapePoints[_i][1] * shapeScale);
    }
    tempCtx.Z().fill("black");
    // Then copying that canvas over
    context.globalCompositeOperation = "destination-in";
    context.drawImage(tempClipCanvas, 0, 0, cX * 2, cY * 2);
    TempCanvas.releaseCanvas(tempClipCanvas);
    context.restore();
  },
  render: function render() {
    var className = this.props.className;
    var drawFunc = this.props.isOffice ? this.drawOfficeProgressCircle : this.drawProgressCircle;
    if (this.props.size) {
      return /*#__PURE__*/React.createElement(CanvasView, {
        className: className,
        draw: drawFunc,
        width: this.props.size,
        height: this.props.size
      });
    }
    return /*#__PURE__*/React.createElement(MeasuredEl, {
      className: className
    }, /*#__PURE__*/React.createElement(CanvasView, {
      draw: drawFunc,
      width: this.props.size,
      height: this.props.size
    }));
  }
});

/***/ },

/***/ "./src/library/BookChapter.jsx"
/*!*************************************!*\
  !*** ./src/library/BookChapter.jsx ***!
  \*************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var withContainerDims = __webpack_require__(/*! ../core/hoc/withContainerDims.jsx */ "./src/core/hoc/withContainerDims.jsx");
var withVaultDispatch = __webpack_require__(/*! ../core/hoc/withVaultDispatch.jsx */ "./src/core/hoc/withVaultDispatch.jsx");
var withVaultUpdate = __webpack_require__(/*! ../core/hoc/withVaultUpdate.jsx */ "./src/core/hoc/withVaultUpdate.jsx");
var AT = __webpack_require__(/*! ../core/vault/ActionTypes.js */ "./src/core/vault/ActionTypes.js");
var _require = __webpack_require__(/*! ../core/util/HOCUtil.js */ "./src/core/util/HOCUtil.js"),
  getBaseInstance = _require.getBaseInstance;
var Sounds = __webpack_require__(/*! ../core/util/Sounds.js */ "./src/core/util/Sounds.js");
var ChapterSection = __webpack_require__(/*! ../../shared/ChapterSection.js */ "./shared/ChapterSection.js");
var SectionUtil = __webpack_require__(/*! ./util/SectionUtil.js */ "./src/library/util/SectionUtil.js");
var TrainerCore = __webpack_require__(/*! ../../shared/TrainerCore.js */ "./shared/TrainerCore.js");
var URLMake = __webpack_require__(/*! ../../shared/URLMake.js */ "./shared/URLMake.js");
var ContainerSize = __webpack_require__(/*! ../core/util/ContainerSize.js */ "./src/core/util/ContainerSize.js");
var Derived = __webpack_require__(/*! ../core/vault/Derived.js */ "./src/core/vault/Derived.js");
var ScrollArea = __webpack_require__(/*! ../core/view/ScrollArea.jsx */ "./src/core/view/ScrollArea.jsx");
var BookPageImageRange = __webpack_require__(/*! ./BookPageImageRange.jsx */ "./src/library/BookPageImageRange.jsx");
var BookChapterMenu = __webpack_require__(/*! ./BookChapterMenu.jsx */ "./src/library/BookChapterMenu.jsx");
var StudentLink = __webpack_require__(/*! ../core/view/StudentLink.jsx */ "./src/core/view/StudentLink.jsx");
var LibraryIcon = __webpack_require__(/*! ./LibraryIcon.jsx */ "./src/library/LibraryIcon.jsx");
var _require2 = __webpack_require__(/*! ../core/view/PortalDestination.tsx */ "./src/core/view/PortalDestination.tsx"),
  PortalDestination = _require2.PortalDestination;
var _require3 = __webpack_require__(/*! ../../shared/PortalConstants.ts */ "./shared/PortalConstants.ts"),
  PORTAL_CONTAINERS = _require3.PORTAL_CONTAINERS;
var BlueButton = __webpack_require__(/*! ../core/view/BlueButton.jsx */ "./src/core/view/BlueButton.jsx");
var AssetsUtil = __webpack_require__(/*! ../core/util/AssetsUtil.js */ "./src/core/util/AssetsUtil.js");
var _require4 = __webpack_require__(/*! ../core/vault/StateCursors.js */ "./src/core/vault/StateCursors.js"),
  atCurrBlock = _require4.atCurrBlock;
var READ_SECONDS = (__webpack_require__(/*! ../../shared/Constants.js */ "./shared/Constants.js").BOOK_PAGE_READ_SECONDS);
var MIN_THUMB_SIZE = 24;
var SHOW_TOP_BAR_AT = 200;
var styles = __webpack_require__(/*! ./styles/BookChapter.css */ "./src/library/styles/BookChapter.css");
var scrollTheme = __webpack_require__(/*! ./styles/BookScrollTheme.css */ "./src/library/styles/BookScrollTheme.css");
var getPropsFromVault = function getPropsFromVault(props, vaultState) {
  var sectionBlockMap = Derived.getSectionBlockMapForChapter(vaultState, props.chapterID);
  var currentBlock = atCurrBlock(vaultState).get();
  return {
    sectionBlockMap: sectionBlockMap,
    currentBlock: currentBlock
  };
};

// Helper to apply higher-order components.
var augment = function augment(Component) {
  Component = withVaultUpdate(Component, getPropsFromVault);
  Component = withVaultDispatch(Component);
  Component = withContainerDims(Component);
  return Component;
};
module.exports = augment(createReactClass({
  displayName: "BookChapter",
  propTypes: {
    gradeNumber: PT.number.isRequired,
    chapterIndex: PT.number.isRequired,
    sectionIndex: PT.number,
    showSingleSection: PT.bool,
    pageNumber: PT.number,
    hideToggle: PT.bool,
    // Needed for chapter menu section heights
    // Based on topContainerWidth
    heightMultiplier: PT.number,
    user: PT.object,
    maxZoom: PT.number,
    chapter: PT.object,
    chapterID: PT.number,
    libraryPages: PT.object,
    demo: PT.bool,
    demoHighlight: PT.bool,
    showLessonLinks: PT.bool,
    hideMenu: PT.bool,
    skipLogging: PT.bool,
    hideTools: PT.bool,
    staticPageWidth: PT.number,
    showDoneButton: PT.bool,
    // Injected by HOCs
    dispatch: PT.func.isRequired,
    containerDims: PT.shape({
      width: PT.number.isRequired,
      height: PT.number.isRequired,
      left: PT.number.isRequired,
      top: PT.number.isRequired,
      windowWidth: PT.number.isRequired,
      windowHeight: PT.number.isRequired
    }).isRequired,
    sectionBlockMap: PT.object.isRequired,
    currentBlock: PT.object
  },
  getDefaultProps: function getDefaultProps() {
    return {
      gradeNumber: 3,
      chapterIndex: 0,
      maxZoom: 0.97 //match css styles.pages with a little bit of margin
    };
  },
  getInitialState: function getInitialState() {
    // Do some initial calculations
    this.updateHeightData();
    return {
      zoom: this.getZoomLevel(this.props) || this.props.maxZoom
    };
  },
  componentDidMount: function componentDidMount() {
    // Set up interval timer to keep track of if current page is read
    var ms = READ_SECONDS * 1000;
    this.debouncedUpdateReadPages = _.debounce(this.updateReadPages, ms);
    this.debouncedZoom = _.debounce(this.zoom, 100);
    var yPos = this.getYPosFromProps(this.props);
    this.scrollToYPos(yPos, {
      force: true
    });
    // Should top bar be open?
    if (yPos <= SHOW_TOP_BAR_AT) {
      this.toggleTopBar(true);
    }
  },
  updateHeightData: function updateHeightData() {
    var _this$props = this.props,
      chapterID = _this$props.chapterID,
      showSingleSection = _this$props.showSingleSection,
      sectionBlockMap = _this$props.sectionBlockMap,
      showLessonLinks = _this$props.showLessonLinks,
      sectionIndex = _this$props.sectionIndex,
      demo = _this$props.demo;
    this.heightData = SectionUtil.getHeightData(chapterID, showSingleSection, sectionBlockMap, showLessonLinks, sectionIndex, demo);
  },
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    var prevPosProps = _.pick(prevProps, ["gradeNumber", "chapterIndex", "sectionIndex", "pageNumber"]);
    var posProps = _.pick(this.props, ["gradeNumber", "chapterIndex", "sectionIndex", "pageNumber"]);
    if (!_.isEqual(prevPosProps, posProps)) {
      this.oldYPos = null;
      var yPos = this.getYPosFromProps(this.props);
      this.scrollToYPos(yPos);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this.debouncedUpdateReadPages.cancel();
    this.debouncedZoom.cancel();
  },
  hideBook: function hideBook() {
    this.props.dispatch({
      type: AT.SET_SHOW_BOOK,
      showBook: false
    });
  },
  getYPosFromProps: function getYPosFromProps(props) {
    var zoom = this.getZoomLevel(props);
    var _ChapterSection$getID = ChapterSection.getIDsFromNumbers(props),
      sectionID = _ChapterSection$getID.sectionID;
    var pageNumber = props.pageNumber,
      sectionIndex = props.sectionIndex,
      showSingleSection = props.showSingleSection,
      containerDims = props.containerDims,
      staticPageWidth = props.staticPageWidth;
    if (pageNumber > 0) {
      return SectionUtil.getPagePosition(this.heightData, pageNumber, staticPageWidth || containerDims.width, zoom);
    } else if (sectionIndex > -1 && !showSingleSection) {
      return SectionUtil.getSectionPosition(this.heightData, sectionID, staticPageWidth || containerDims.width, zoom);
    } else {
      return 0;
    }
  },
  getPageFromYPos: function getPageFromYPos(yPos) {
    var _this$props2 = this.props,
      containerDims = _this$props2.containerDims,
      staticPageWidth = _this$props2.staticPageWidth;
    var zoom = this.state.zoom;
    return SectionUtil.getPageFromPosition(this.heightData, yPos, staticPageWidth || containerDims.width, zoom);
  },
  getCurrentScrollPage: function getCurrentScrollPage() {
    return this.getPageFromYPos(this.scrollAreaRef.getScrollPos()[1]);
  },
  scrollToYPos: function scrollToYPos(newYPos) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$force = _ref.force,
      force = _ref$force === void 0 ? false : _ref$force;
    this.setViewedPageIfChanged(newYPos);
    this.oldYPos = newYPos;
    this.scrollAreaRef.scrollToY(newYPos, {
      force: force
    });
  },
  onScroll: function onScroll(newYPos) {
    if (this.oldYPos <= SHOW_TOP_BAR_AT && newYPos > SHOW_TOP_BAR_AT) {
      this.toggleTopBar(false);
    } else if (this.oldYPos > SHOW_TOP_BAR_AT && newYPos <= SHOW_TOP_BAR_AT) {
      // Only open top bar if chapter menu is not already open
      if (!this.props.hideMenu && !this.chapterMenu.getIsMenuOpen()) {
        this.toggleTopBar(true);
      }
    }
    this.setViewedPageIfChanged(newYPos);
    this.oldYPos = newYPos;
  },
  onSpecialKeys: function onSpecialKeys(axis, code) {
    if (code === "esc") {
      this.toggleTopBar(true);
      return;
    }
    var _this$props3 = this.props,
      chapterID = _this$props3.chapterID,
      demo = _this$props3.demo,
      containerDims = _this$props3.containerDims,
      staticPageWidth = _this$props3.staticPageWidth;
    var zoom = this.state.zoom;
    // Axis should always be "y"
    var currentPage = this.getCurrentScrollPage();
    var newPage = currentPage;
    if (code === "left") {
      // Move to beginning of previous page
      // TODO: Maybe make this scroll to the start of the current page if you're in the middle of a page
      newPage -= 1;
    } else if (code === "right") {
      // Move to beginning of next page
      newPage += 1;
    }
    if (newPage !== currentPage && SectionUtil.isPageInChapter(chapterID, newPage, demo)) {
      var newY = SectionUtil.getPagePosition(this.heightData, newPage, staticPageWidth || containerDims.width, zoom);
      this.onScroll(newY);
      this.scrollToYPos(newY);
    }
  },
  setViewedPageIfChanged: function setViewedPageIfChanged(newYPos) {
    var oldPage = this.getPageFromYPos(this.oldYPos);
    var currentPage = this.getPageFromYPos(newYPos);
    if (currentPage && oldPage !== currentPage) {
      this.debouncedUpdateReadPages(currentPage);
      // This action also does page loading.
      this.props.dispatch({
        type: AT.SET_VIEWED_LIBRARY_PAGE,
        chapterID: this.props.chapterID,
        pageNumber: currentPage
      });
    }
  },
  updateReadPages: function updateReadPages(currentPage) {
    var _this$props4 = this.props,
      chapter = _this$props4.chapter,
      chapterID = _this$props4.chapterID,
      user = _this$props4.user,
      skipLogging = _this$props4.skipLogging;
    if (skipLogging) return;
    var pagesRead = _.get(chapter, ["model", "pagesRead"], []);
    if (!_.includes(pagesRead, currentPage)) {
      this.props.dispatch({
        type: AT.UPDATE_PAGES_READ,
        userID: user.userID,
        chapterID: chapterID,
        pageJustRead: currentPage
      });
    }
  },
  toggleTopBar: function toggleTopBar(shouldOpen) {
    if (!this.props.hideToggle) {
      this.props.dispatch({
        type: AT.TOGGLE_TOP_BAR,
        isOpen: shouldOpen
      });
    }
  },
  onMenuToggle: function onMenuToggle(isOpen) {
    var scrollPos = this.scrollAreaRef.getScrollPos()[1];
    if (isOpen) {
      this.toggleTopBar(false);
    } else if (scrollPos <= SHOW_TOP_BAR_AT) {
      this.toggleTopBar(true);
    }
  },
  onDoneButton: function onDoneButton() {
    var _this$props5 = this.props,
      user = _this$props5.user,
      chapterID = _this$props5.chapterID;
    var _ChapterSection$getID2 = ChapterSection.getIDsFromNumbers(this.props),
      sectionID = _ChapterSection$getID2.sectionID;
    this.props.dispatch({
      type: AT.UPDATE_SECTIONS_MARKED_DONE,
      userID: user.userID,
      chapterID: chapterID,
      sectionID: sectionID
    });
    this.props.dispatch({
      type: AT.SET_SHOW_BOOK,
      showBook: false,
      sectionID: sectionID
    });
  },
  zoom: function zoom(isIn) {
    //isIn = isZoomIn
    var zoom = this.state.zoom;
    var newZoom = _.clamp(zoom + (isIn ? 0.1 : -0.1), this.getMinZoom(), this.props.maxZoom);
    if (newZoom !== zoom) {
      Sounds.playSound("thud");
      var actionType = this.props.demo ? AT.UPDATE_TEMP_USER_SETTINGS : AT.UPDATE_USER_SETTINGS;
      this.props.dispatch({
        type: actionType,
        // Save ratio of zoom  to maxZoom instead of absolute zoom,
        // because maxZoom is different in library and trainer book modal
        bookZoomRatio: _.round(newZoom / this.props.maxZoom, 3)
      });
      this.setState({
        zoom: newZoom
      });
    }
  },
  // Can we zoom in/out any more?
  canZoom: function canZoom(isIn) {
    var minZoom = this.getMinZoom();
    var maxZoom = this.props.maxZoom;
    if (isIn) {
      return this.state.zoom < maxZoom;
    } else {
      return this.state.zoom > minZoom;
    }
  },
  getMinZoom: function getMinZoom() {
    var width = this.props.containerDims.width;
    var minWidth = this.props.containerDims.width / 4;
    return minWidth / width;
  },
  getZoomLevel: function getZoomLevel(props) {
    var zoomRatio = _.get(props.user, "model.settings.bookZoomRatio", 1);
    return zoomRatio * props.maxZoom;
  },
  renderMenu: function renderMenu(chapterID) {
    var _this = this;
    var _this$props6 = this.props,
      showSingleSection = _this$props6.showSingleSection,
      chapterIndex = _this$props6.chapterIndex,
      sectionIndex = _this$props6.sectionIndex,
      containerDims = _this$props6.containerDims,
      demo = _this$props6.demo,
      heightMultiplier = _this$props6.heightMultiplier,
      hideToggle = _this$props6.hideToggle;
    var zoom = this.state.zoom;
    var goToSection = function goToSection(s) {
      var sectionPosition = SectionUtil.getSectionPosition(_this.heightData, s, containerDims.width, zoom);
      _this.scrollToYPos(sectionPosition);
    };
    return /*#__PURE__*/React.createElement(BookChapterMenu, {
      ref: function ref(m) {
        return _this.chapterMenu = getBaseInstance(m);
      },
      chapterID: chapterID,
      chapterIndex: chapterIndex,
      goToSection: goToSection,
      hideToggle: hideToggle || demo,
      onToggle: this.onMenuToggle,
      heightMultiplier: heightMultiplier,
      showOnlySection: showSingleSection ? sectionIndex : null,
      demo: demo,
      heightData: this.heightData,
      pageWidth: containerDims.width,
      zoom: zoom
    });
  },
  renderLibraryLink: function renderLibraryLink() {
    var iconStyle = this.props.demoHighlight ? styles.demoHighlight : styles.icon;
    return /*#__PURE__*/React.createElement(StudentLink, {
      to: URLMake.forLibraryFromNumbers(this.props.gradeNumber),
      className: iconStyle,
      clickSound: "button-click",
      useWonkyCursor: true
    }, /*#__PURE__*/React.createElement(LibraryIcon, {
      className: styles.octagon,
      type: "book"
    }));
  },
  renderDoneButton: function renderDoneButton() {
    return /*#__PURE__*/React.createElement(BlueButton, {
      buttonText: "Done!",
      handleClick: this.onDoneButton
    });
  },
  render: function render() {
    var _this2 = this;
    var _this$props7 = this.props,
      hideToggle = _this$props7.hideToggle,
      libraryPages = _this$props7.libraryPages,
      containerDims = _this$props7.containerDims,
      demo = _this$props7.demo,
      showSingleSection = _this$props7.showSingleSection,
      gradeNumber = _this$props7.gradeNumber,
      chapterIndex = _this$props7.chapterIndex,
      sectionIndex = _this$props7.sectionIndex,
      sectionBlockMap = _this$props7.sectionBlockMap,
      showLessonLinks = _this$props7.showLessonLinks,
      user = _this$props7.user,
      hideTools = _this$props7.hideTools,
      chapterID = _this$props7.chapterID,
      staticPageWidth = _this$props7.staticPageWidth;
    var containerSize = ContainerSize.getContainerSizeFromWindow();
    var remHeight = ContainerSize.getRootFontSize(containerSize);
    this.heightData = SectionUtil.getHeightData(chapterID, showSingleSection, sectionBlockMap, showLessonLinks, sectionIndex, demo);
    var zoom = this.state.zoom;
    var pageRange;
    if (showSingleSection) {
      var sectionID = ChapterSection.getSectionIDFromContext({
        gradeNumber: gradeNumber,
        chapterIndex: chapterIndex,
        sectionIndex: sectionIndex
      });
      pageRange = ChapterSection.getChapterSectionPages(sectionID);
    } else {
      pageRange = ChapterSection.getChapterPages(chapterID, demo);
    }
    var bookHash = ChapterSection.getBookHash(chapterID);
    var pageWidth = (staticPageWidth || containerDims.width) * this.state.zoom;
    var totalPagesHeight = SectionUtil.getTotalPagesHeight(this.heightData, staticPageWidth || containerDims.width, zoom);
    //padding = 5 matches css
    // For demo, need this height accounts for the "bump" downward  since we don't allow
    // the top bar to be minimized
    var topBumper = null;
    var topBumperHeight = 0;
    var buttonBumperHeight = staticPageWidth ? 0 : 80;
    if (demo) {
      topBumper = /*#__PURE__*/React.createElement("div", {
        className: styles.demoBumper
      });
      topBumperHeight = remHeight * 7;
    }
    var playButton = null;
    if (this.props.currentBlock) {
      var currentBlockTitle = _.get(this.props.currentBlock, "model.displayName") || "";
      var requirementLevel = _.get(this.props.currentBlock, "model.requirementLevel");
      var isBonus = TrainerCore.isBonusBlock(requirementLevel);
      var buttonSrc = isBonus ? AssetsUtil.getGeneralIcon("icon-bonus-beast") : AssetsUtil.getButton("bell", "white");
      playButton = /*#__PURE__*/React.createElement(BlueButton, {
        buttonText: "Play",
        handleClick: this.hideBook,
        buttonType: "trapNormal",
        buttonImageSrc: buttonSrc,
        extraText: currentBlockTitle,
        className: styles.blueButton
      });
    } else {
      buttonBumperHeight = 0;
    }
    var showDoneButton = this.props.showDoneButton && !this.props.currentBlock;
    var doneButtonHeight = showDoneButton ? 8 * remHeight : 0;
    var pagesStyle = {
      height: totalPagesHeight + topBumperHeight + buttonBumperHeight + doneButtonHeight
    };
    var tools = hideTools ? null : /*#__PURE__*/React.createElement("div", {
      className: styles.tools
    }, hideToggle ? null : this.renderLibraryLink(), /*#__PURE__*/React.createElement("div", {
      className: styles.icon
    }, /*#__PURE__*/React.createElement(LibraryIcon, {
      className: styles.zoom,
      type: "zoom-in",
      isDisabled: !this.canZoom(true),
      clickHandler: function clickHandler() {
        return _this2.debouncedZoom(true);
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: styles.icon
    }, /*#__PURE__*/React.createElement(LibraryIcon, {
      className: styles.zoom,
      type: "zoom-out",
      isDisabled: !this.canZoom(false),
      clickHandler: function clickHandler() {
        return _this2.debouncedZoom(false);
      }
    })));
    return /*#__PURE__*/React.createElement("div", {
      className: styles.main
    }, /*#__PURE__*/React.createElement(PortalDestination, {
      name: PORTAL_CONTAINERS.DEMO_TUTORIAL_MODAL
    }), /*#__PURE__*/React.createElement(ScrollArea, {
      ref: function ref(_ref2) {
        return _this2.scrollAreaRef = getBaseInstance(_ref2);
      },
      contentClassName: styles.scroll,
      hasXScroll: false,
      contentStyle: pagesStyle,
      noFade: true,
      preservePosRatio: true,
      minYThumbSize: MIN_THUMB_SIZE,
      useGlobalHotkeysForY: true,
      useMouseMoveToScroll: true,
      onScrollY: this.onScroll,
      mainTheme: scrollTheme,
      onKeySpecial: this.onSpecialKeys,
      useWonkyCursor: true,
      areaStyle: {
        backgroundColor: "white"
      }
    }, topBumper, /*#__PURE__*/React.createElement(BookPageImageRange, {
      bookHash: bookHash,
      pageMin: pageRange[0],
      pageMax: pageRange[1],
      pageWidth: pageWidth,
      libraryPages: libraryPages,
      showLessonLinks: showLessonLinks,
      sectionBlockMap: sectionBlockMap,
      user: user
    }), playButton, showDoneButton && this.renderDoneButton(chapterID)), this.props.hideMenu ? null : this.renderMenu(chapterID), /*#__PURE__*/React.createElement("div", {
      className: styles.border
    }), /*#__PURE__*/React.createElement("div", {
      className: styles.line
    }), tools);
  }
}));

/***/ },

/***/ "./src/library/BookChapterMenu.jsx"
/*!*****************************************!*\
  !*** ./src/library/BookChapterMenu.jsx ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var GradeChapter = __webpack_require__(/*! ../../shared/GradeChapter.js */ "./shared/GradeChapter.js");
var URLMake = __webpack_require__(/*! ../../shared/URLMake.js */ "./shared/URLMake.js");
var ChapterSection = __webpack_require__(/*! ../../shared/ChapterSection.js */ "./shared/ChapterSection.js");
var SectionUtil = __webpack_require__(/*! ./util/SectionUtil.js */ "./src/library/util/SectionUtil.js");
var ContainerSize = __webpack_require__(/*! ../core/util/ContainerSize.js */ "./src/core/util/ContainerSize.js");
var withContainerDims = __webpack_require__(/*! ../core/hoc/withContainerDims.jsx */ "./src/core/hoc/withContainerDims.jsx");
var Quad = __webpack_require__(/*! ../core/view/Quad.jsx */ "./src/core/view/Quad.jsx");
var QuadUtil = __webpack_require__(/*! ../core/util/QuadUtil.js */ "./src/core/util/QuadUtil.js");
var Sounds = __webpack_require__(/*! ../core/util/Sounds.js */ "./src/core/util/Sounds.js");
var Link = __webpack_require__(/*! ../core/view/Link.jsx */ "./src/core/view/Link.jsx");
var ArrowIcon = __webpack_require__(/*! ../core/view/ArrowIcon.jsx */ "./src/core/view/ArrowIcon.jsx");
var styles = __webpack_require__(/*! ./styles/BookChapterMenu.css */ "./src/library/styles/BookChapterMenu.css");

// Helper to apply higher-order components.
var augment = function augment(Component) {
  Component = withContainerDims(Component);
  return Component;
};
module.exports = augment(createReactClass({
  displayName: "BookChapterMenu",
  propTypes: {
    chapterID: PT.number.isRequired,
    chapterIndex: PT.number.isRequired,
    showOnlySection: PT.number,
    goToSection: PT.func.isRequired,
    heightMultiplier: PT.number,
    hideToggle: PT.bool,
    onToggle: PT.func,
    demo: PT.bool,
    heightData: PT.array.isRequired,
    pageWidth: PT.number,
    zoom: PT.number,
    // Injected by HOCs
    containerDims: PT.shape({
      width: PT.number.isRequired,
      height: PT.number.isRequired,
      left: PT.number.isRequired,
      top: PT.number.isRequired,
      windowWidth: PT.number.isRequired,
      windowHeight: PT.number.isRequired
    }).isRequired
  },
  getInitialState: function getInitialState() {
    return {
      isMenuOpen: false
    };
  },
  goToSection: function goToSection(s) {
    Sounds.playSound("book-section-click");
    this.setState({
      isMenuOpen: false
    });
    this.props.goToSection(s);
  },
  toggleMenu: function toggleMenu() {
    var isOpen = !this.state.isMenuOpen;
    var clickSound = isOpen ? "arrow-right" : "arrow-left";
    Sounds.playSound(clickSound);
    this.props.onToggle && this.props.onToggle(isOpen);
    this.setState({
      isMenuOpen: isOpen
    });
  },
  getIsMenuOpen: function getIsMenuOpen() {
    return this.state.isMenuOpen;
  },
  renderSections: function renderSections(sectionSizes) {
    var _this = this;
    var _this$props = this.props,
      chapterID = _this$props.chapterID,
      chapterIndex = _this$props.chapterIndex,
      demo = _this$props.demo,
      showOnlySection = _this$props.showOnlySection;
    var tabs = ChapterSection.getChapterSections(chapterID, demo);
    var adjHeights = sectionSizes.adjHeights,
      chapterIntroPagesHeight = sectionSizes.chapterIntroPagesHeight;
    var nextButton = null;
    var prevButton = null;
    var nextChapterIndex = chapterIndex + 1;
    var prevChapterIndex = chapterIndex - 1;
    var gradeNumber = GradeChapter.chapterIDToGradeID(chapterID);
    var makeArrowIcon = function makeArrowIcon(dir) {
      return /*#__PURE__*/React.createElement(ArrowIcon, {
        arrowClass: styles.navArrow,
        direction: dir,
        colorName: "blue",
        type: "sharp",
        size: 1.5,
        useColorHoverEffect: true,
        preventScaleHover: true,
        useWonkyCursor: true
      });
    };

    // TODO: check for existence if we don't have full set of books for grade
    if (nextChapterIndex < 12) {
      nextButton = /*#__PURE__*/React.createElement(Link, {
        to: URLMake.forLibraryFromNumbers(gradeNumber, nextChapterIndex),
        clickSound: "arrow-right",
        useWonkyCursor: true
      }, makeArrowIcon("right"));
    }
    if (prevChapterIndex >= 0) {
      prevButton = /*#__PURE__*/React.createElement(Link, {
        to: URLMake.forLibraryFromNumbers(gradeNumber, prevChapterIndex),
        clickSound: "arrow-left",
        useWonkyCursor: true
      }, makeArrowIcon("left"));
    }
    var frontStyle = {
      height: chapterIntroPagesHeight
    };
    var chapterEl = null;
    if (!this.props.hideToggle) {
      chapterEl = /*#__PURE__*/React.createElement("div", {
        className: styles.chapterTitle
      }, /*#__PURE__*/React.createElement("div", {
        className: styles.nav
      }, prevButton), /*#__PURE__*/React.createElement("div", {
        className: styles.titleText,
        onClick: function onClick() {
          return _this.goToSection(0);
        }
      }, chapterIndex + 1 + ": " + ChapterSection.getChapterName(chapterID)), /*#__PURE__*/React.createElement("div", {
        className: styles.nav
      }, nextButton));
    }
    var chapterFront = [/*#__PURE__*/React.createElement("div", {
      key: "front",
      className: styles.front,
      style: frontStyle
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.sectionQuad
    }, /*#__PURE__*/React.createElement(Quad, {
      quad: QuadUtil.getBookMenuSectionQuad(0, true),
      backgroundClass: styles.titleBg
    })), chapterEl)];
    var tabEls;
    var generateTab = function generateTab(s, i) {
      var data = ChapterSection.getSectionData(s);
      var tabStyle = {
        height: adjHeights[i]
      };
      var titleEl = null;
      if (!_this.props.hideToggle) {
        titleEl = /*#__PURE__*/React.createElement("div", {
          className: styles.sectionTitle
        }, data.name);
      }
      var sectionEl = _this.props.hideToggle ? /*#__PURE__*/React.createElement("div", {
        className: styles[data.character] + " " + styles.sectionFlat
      }) : /*#__PURE__*/React.createElement(Quad, {
        quad: QuadUtil.getBookMenuSectionQuad(i + 1, false, i === tabs.length - 1),
        backgroundClass: styles[data.character]
      });
      return /*#__PURE__*/React.createElement("div", {
        style: tabStyle,
        className: styles.sectionBg,
        onClick: function onClick() {
          return _this.goToSection(s);
        },
        key: "section" + s
      }, /*#__PURE__*/React.createElement("div", {
        className: styles.sectionQuad
      }, sectionEl), titleEl);
    };
    if (showOnlySection) {
      tabEls = [generateTab(tabs[showOnlySection], 0)];
    } else {
      tabEls = tabs.map(generateTab);
    }
    return chapterFront.concat(tabEls);
  },
  render: function render() {
    var _this$props2 = this.props,
      containerDims = _this$props2.containerDims,
      heightMultiplier = _this$props2.heightMultiplier,
      heightData = _this$props2.heightData,
      pageWidth = _this$props2.pageWidth,
      zoom = _this$props2.zoom;
    var isMenuOpen = this.state.isMenuOpen;
    var hideToggle = this.props.hideToggle;
    var toggleEl = null;
    if (!hideToggle) {
      var toggleQuad = /*#__PURE__*/React.createElement("img", {
        className: styles.toggleOct,
        src: globalThis.BASE_URL + "assets/images/icons/button-octagon-white.svg"
      });
      toggleEl = /*#__PURE__*/React.createElement("div", {
        className: styles.toggle,
        onClick: this.toggleMenu
      }, toggleQuad, /*#__PURE__*/React.createElement(ArrowIcon, {
        direction: isMenuOpen ? "right" : "left",
        colorName: "blue",
        type: "tail-wonky",
        preventScaleHover: true,
        size: 1.4,
        useWonkyCursor: true
      }));
    }
    var fontSize = ContainerSize.getFontSizes(containerDims).bookMenu;
    var menuHeight = containerDims.height * (heightMultiplier || 1);
    var sectionSizes = SectionUtil.getSectionSizes(heightData, fontSize, menuHeight, pageWidth, zoom);
    var mainClass = isMenuOpen ? styles.open : styles.closed;
    if (hideToggle) {
      mainClass = styles.mainSlim;
    }
    return /*#__PURE__*/React.createElement("div", {
      className: mainClass
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.sections
    }, this.renderSections(sectionSizes)), toggleEl, /*#__PURE__*/React.createElement("div", {
      className: styles.border
    }));
  }
}));

/***/ },

/***/ "./src/library/BookChapterModal.jsx"
/*!******************************************!*\
  !*** ./src/library/BookChapterModal.jsx ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var ErrorUtil = __webpack_require__(/*! ../../shared/ErrorUtil.js */ "./shared/ErrorUtil.js");
var ReactPageTrainerError = __webpack_require__(/*! ../core/view/ReactPageTrainerError.jsx */ "./src/core/view/ReactPageTrainerError.jsx");
var BookChapter = __webpack_require__(/*! ./BookChapter.jsx */ "./src/library/BookChapter.jsx");
var styles = __webpack_require__(/*! ./styles/BookChapterModal.css */ "./src/library/styles/BookChapterModal.css");
module.exports = createReactClass({
  displayName: "BookChapterModal",
  propTypes: {
    gradeNumber: PT.number.isRequired,
    chapterIndex: PT.number.isRequired,
    sectionIndex: PT.number,
    // Used to show single section when student is in trainer section
    showSingleSection: PT.bool,
    pageNumber: PT.number,
    // Needed for chapter menu section heights
    // Based on topContainerWidth
    heightMultiplier: PT.number,
    user: PT.object,
    maxZoom: PT.number,
    chapter: PT.object,
    chapterID: PT.number,
    libraryPages: PT.object,
    demo: PT.bool,
    hideMenu: PT.bool
  },
  getInitialState: function getInitialState() {
    return {
      reactCrashed: false,
      reactCrashOutOfMemory: false
    };
  },
  componentDidCatch: function componentDidCatch(error, info) {
    ErrorUtil.log("E_REACT_CRASH", error, {
      componentStack: info.componentStack
    });
    this.setState({
      reactCrashed: true,
      reactCrashOutOfMemory: error && error.message === "out of memory"
    });
  },
  render: function render() {
    var bookEl;
    var shadowClass = styles.shadow;
    var props = _.extend({
      hideToggle: true,
      showDoneButton: true
    }, this.props);
    if (this.state.reactCrashed) {
      shadowClass += " " + styles.shadowAdj;
      bookEl = /*#__PURE__*/React.createElement(ReactPageTrainerError, {
        isReactCrash: true,
        inModal: true,
        outOfMemory: this.state.reactCrashOutOfMemory
      });
    } else {
      bookEl = /*#__PURE__*/React.createElement(BookChapter, props);
    }
    return /*#__PURE__*/React.createElement("div", {
      className: styles.content
    }, bookEl, /*#__PURE__*/React.createElement("div", {
      className: shadowClass
    }));
  }
});

/***/ },

/***/ "./src/library/BookPageImage.jsx"
/*!***************************************!*\
  !*** ./src/library/BookPageImage.jsx ***!
  \***************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var SectionUtil = __webpack_require__(/*! ./util/SectionUtil.js */ "./src/library/util/SectionUtil.js");
var LoadGuard = __webpack_require__(/*! ../core/view/LoadGuard.jsx */ "./src/core/view/LoadGuard.jsx");
var LoadingCircle = __webpack_require__(/*! ../core/view/LoadingCircle.jsx */ "./src/core/view/LoadingCircle.jsx");
var styles = __webpack_require__(/*! ./styles/BookPageImage.css */ "./src/library/styles/BookPageImage.css");
var PAGE_RATIO = SectionUtil.PAGE_RATIO; // width/height

module.exports = createReactClass({
  displayName: "BookPageImage",
  propTypes: {
    bookHash: PT.string,
    pageNumber: PT.number.isRequired,
    pageWidth: PT.number,
    pageData: PT.shape({
      load: PT.string.isRequired,
      loadError: PT.string,
      pageData: PT.array
    }).isRequired
  },
  renderPage: function renderPage() {
    var pagePartsEls = _.map(this.props.pageData.pageData, function (p, key) {
      var bg = {
        backgroundImage: "url(data:image/png;base64," + p + ")"
      };
      return /*#__PURE__*/React.createElement("div", {
        className: styles.cropped,
        key: key,
        style: bg
      });
    });
    return /*#__PURE__*/React.createElement("div", {
      key: "page" + this.props.pageNumber,
      className: styles.pageParts
    }, pagePartsEls);
  },
  renderView: function renderView(type) {
    var mainEl;
    var textStyle = {
      fontSize: Math.min(25, this.props.pageWidth / 20)
    };
    if (type === "error") {
      mainEl = /*#__PURE__*/React.createElement("div", {
        className: styles.error,
        style: textStyle
      }, "There was a problem loading this page.");
    } else if (type === "loading") {
      var centerEl = /*#__PURE__*/React.createElement("div", {
        className: styles.pageNumber,
        style: textStyle
      }, "Page", /*#__PURE__*/React.createElement("br", null), this.props.pageNumber);
      mainEl = /*#__PURE__*/React.createElement("div", {
        className: styles.loading
      }, /*#__PURE__*/React.createElement(LoadingCircle, {
        colorType: "transparentGray",
        centerEl: centerEl
      }));
    }
    return /*#__PURE__*/React.createElement("div", {
      className: styles.loadingOuter
    }, mainEl);
  },
  render: function render() {
    var _this$props = this.props,
      pageNumber = _this$props.pageNumber,
      bookHash = _this$props.bookHash,
      pageWidth = _this$props.pageWidth;
    var pageStyle = {
      width: pageWidth,
      height: pageWidth / PAGE_RATIO
    };
    var character = SectionUtil.getSectionCharacterFromBookPage(bookHash, pageNumber) || "title";
    var pageImage = /*#__PURE__*/React.createElement(LoadGuard, {
      identifier: "page" + pageNumber,
      status: this.props.pageData,
      errorView: this.renderView("error"),
      loadingView: this.renderView("loading"),
      renderLoaded: this.renderPage
    });
    return /*#__PURE__*/React.createElement("div", {
      key: (bookHash || "title") + "-" + pageNumber,
      className: styles.main,
      style: pageStyle
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.container
    }, /*#__PURE__*/React.createElement("div", {
      className: styles[character]
    }), pageImage));
  }
});

/***/ },

/***/ "./src/library/BookPageImageRange.jsx"
/*!********************************************!*\
  !*** ./src/library/BookPageImageRange.jsx ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var SCU = __webpack_require__(/*! ../core/util/SCUUtil.js */ "./src/core/util/SCUUtil.js");
var OpsLibraryPages = __webpack_require__(/*! ./vault/OpsLibraryPages.js */ "./src/library/vault/OpsLibraryPages.js");
var BookPageImage = __webpack_require__(/*! ./BookPageImage.jsx */ "./src/library/BookPageImage.jsx");
var SectionUtil = __webpack_require__(/*! ./util/SectionUtil.js */ "./src/library/util/SectionUtil.js");
var AssetsUtil = __webpack_require__(/*! ../core/util/AssetsUtil.js */ "./src/core/util/AssetsUtil.js");
var URLMake = __webpack_require__(/*! ../../shared/URLMake.js */ "./shared/URLMake.js");
var CopyTable = __webpack_require__(/*! ../core/util/CopyTable.js */ "./src/core/util/CopyTable.js");
var BlueButton = __webpack_require__(/*! ../core/view/BlueButton.jsx */ "./src/core/view/BlueButton.jsx");
var ChooseOptionModal = __webpack_require__(/*! ../core/view/ChooseOptionModal.jsx */ "./src/core/view/ChooseOptionModal.jsx");
var withSetURL = __webpack_require__(/*! ../core/hoc/withSetURL.jsx */ "./src/core/hoc/withSetURL.jsx");
var LibraryLessonButton = __webpack_require__(/*! ./LibraryLessonButton.jsx */ "./src/library/LibraryLessonButton.jsx");
var styles = __webpack_require__(/*! ./styles/BookPageImageRange.css */ "./src/library/styles/BookPageImageRange.css");
var modalStyles = __webpack_require__(/*! ../core/view/styles/ModalGeneral.css */ "./src/core/view/styles/ModalGeneral.css");

// Helper to apply higher-order components.
var augment = function augment(Component) {
  Component = withSetURL(Component);
  return Component;
};
module.exports = augment(createReactClass({
  displayName: "BookPageImageRange",
  propTypes: {
    bookHash: PT.string,
    pageMin: PT.number.isRequired,
    pageMax: PT.number.isRequired,
    pageWidth: PT.number,
    libraryPages: PT.object,
    showLessonLinks: PT.bool,
    sectionBlockMap: PT.object,
    user: PT.object,
    // Injected by HOCs
    setURL: PT.func.isRequired
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    return !SCU.shallowEq(this.props, nextProps) || !SCU.shallowEq(this.state.modalInfo, nextState.modalInfo);
  },
  getInitialState: function getInitialState() {
    return {
      modalInfo: null
    };
  },
  renderLibraryToLessonModal: function renderLibraryToLessonModal(_ref) {
    var _this = this;
    var messageType = _ref.messageType,
      chapterIndex = _ref.chapterIndex,
      gradeNumber = _ref.gradeNumber;
    var chapterNumber = chapterIndex + 1;
    var modalMessageText = CopyTable.forLibraryToBlockModal(messageType, this.props.user);
    var modalMessage = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, modalMessageText), /*#__PURE__*/React.createElement("p", null, "Visit ", /*#__PURE__*/React.createElement("img", {
      className: styles.gradeIcon,
      src: AssetsUtil.getImageForGrade(gradeNumber, "white")
    }), "Chapter ".concat(chapterNumber, " anyway?")));
    var closeModal = function closeModal() {
      return _this.setState({
        modalInfo: null
      });
    };
    // We use substitutes here because the first button needs custom text
    // that depends on grade and chapter numbers. Without substitutes,
    // ChooseOptionModal sets this text with buttonType of BlueButton
    // which doesn't support text with changing variables.
    var buttonSubstitutes = [/*#__PURE__*/React.createElement(BlueButton, {
      key: "button-" + 0,
      className: modalStyles.button,
      handleClick: function handleClick() {
        return _this.props.setURL(URLMake.forChapterFromNumbers(gradeNumber, chapterIndex));
      },
      buttonText: "Chapter ".concat(chapterNumber),
      buttonType: "chapterx",
      buttonImageSrc: AssetsUtil.getButton("bell", "white"),
      buttonImageSize: 3
    }), /*#__PURE__*/React.createElement(BlueButton, {
      key: "button-" + 1,
      className: modalStyles.button,
      handleClick: closeModal,
      buttonType: "keepreading",
      buttonImageSrc: AssetsUtil.getButton("book", "white"),
      buttonImageSize: 3
    })];
    return /*#__PURE__*/React.createElement(ChooseOptionModal, {
      buttonSubstitute: buttonSubstitutes,
      onClose: closeModal,
      size: "extra-large"
    }, modalMessage);
  },
  makeLessonLinks: function makeLessonLinks(sectionID) {
    var _this2 = this;
    var _this$props = this.props,
      user = _this$props.user,
      sectionBlockMap = _this$props.sectionBlockMap,
      bookHash = _this$props.bookHash;
    var lessonLinks = [];
    var blockModels = sectionBlockMap[sectionID];
    var gradeNumber = parseInt(bookHash.charAt(0));
    var makeButton = function makeButton(model, shape) {
      return /*#__PURE__*/React.createElement(LibraryLessonButton, {
        key: "block" + model.blockID + "LessonLink",
        model: model,
        setModalInfo: function setModalInfo(modalInfo) {
          return _this2.setState({
            modalInfo: modalInfo
          });
        },
        shapeNumber: shape,
        gradeNumber: gradeNumber,
        user: user
      });
    };
    var fillerCount = 0;
    var makeRow = function makeRow(numberInRow, startingIndex) {
      var addButtons = function addButtons(qty) {
        for (var i = startingIndex; i < startingIndex + qty; i++) {
          lessonLinks.push(makeButton(blockModels[i], i));
        }
      };
      var addFiller = function addFiller() {
        lessonLinks.push(/*#__PURE__*/React.createElement("div", {
          className: styles.fillerHalf,
          key: "section".concat(sectionID, "filler").concat(fillerCount++)
        }));
      };
      if (numberInRow === 4) {
        addButtons(4);
      } else if (numberInRow === 3) {
        addFiller();
        addButtons(3);
        addFiller();
      } else if (numberInRow === 2) {
        addFiller();
        addFiller();
        addButtons(2);
        addFiller();
        addFiller();
      }
    };
    if (blockModels.length === 5) {
      makeRow(3, 0);
      makeRow(2, 3);
    } else if (blockModels.length === 6) {
      makeRow(3, 0);
      makeRow(3, 3);
    } else if (blockModels.length === 9) {
      makeRow(3, 0);
      makeRow(3, 3);
      makeRow(3, 6);
    } else if (blockModels.length === 10) {
      makeRow(3, 0);
      makeRow(4, 3);
      makeRow(3, 7);
    } else {
      _.each(blockModels, function (blockModel, i) {
        lessonLinks.push(makeButton(blockModel, i));
      });
    }
    return lessonLinks;
  },
  render: function render() {
    var _this$props2 = this.props,
      bookHash = _this$props2.bookHash,
      pageMin = _this$props2.pageMin,
      pageMax = _this$props2.pageMax,
      libraryPages = _this$props2.libraryPages,
      pageWidth = _this$props2.pageWidth,
      showLessonLinks = _this$props2.showLessonLinks,
      sectionBlockMap = _this$props2.sectionBlockMap;
    var bookPages = [];
    for (var p = pageMin; p <= pageMax; p++) {
      bookPages.push(/*#__PURE__*/React.createElement(BookPageImage, {
        key: bookHash + p,
        bookHash: bookHash,
        pageNumber: p,
        pageWidth: pageWidth,
        pageData: OpsLibraryPages.getDataForPageNumber(libraryPages, p)
      }));
      if (showLessonLinks) {
        var sectionID = SectionUtil.getSectionIDFromBookPage(bookHash, p) || 0;

        // Show links after last page in section
        var onLastPageOfIntro = showLessonLinks ? p === pageMin + 1 : false;
        var onLastPageOfNormalSection = sectionID && p === SectionUtil.getSectionPages(sectionID)[1];
        if ((onLastPageOfIntro || onLastPageOfNormalSection) && sectionBlockMap[sectionID].length) {
          var signText = onLastPageOfNormalSection ? "Try these lessons." : "Try these lessons first.";
          var stopSign = /*#__PURE__*/React.createElement("div", {
            key: "section" + sectionID + "StopSign",
            className: styles.stopSign
          }, /*#__PURE__*/React.createElement("div", {
            className: styles.stopSignText
          }, signText));
          var lessonLinks = this.makeLessonLinks(sectionID);
          bookPages.push(/*#__PURE__*/React.createElement("div", {
            key: bookHash + "Section" + sectionID + "Links",
            className: styles.lessonLinksOuter
          }, stopSign, /*#__PURE__*/React.createElement("div", {
            className: styles.linksContainer
          }, lessonLinks)));
        }
      }
    }
    var modal;
    var modalInfo = this.state.modalInfo;
    if (modalInfo) modal = this.renderLibraryToLessonModal(modalInfo);
    return /*#__PURE__*/React.createElement("div", {
      className: styles.main
    }, bookPages, modal);
  }
}));

/***/ },

/***/ "./src/library/ChapterTile.jsx"
/*!*************************************!*\
  !*** ./src/library/ChapterTile.jsx ***!
  \*************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var Quad = __webpack_require__(/*! ../core/view/Quad.jsx */ "./src/core/view/Quad.jsx");
var QuadUtil = __webpack_require__(/*! ../core/util/QuadUtil.js */ "./src/core/util/QuadUtil.js");
var Sounds = __webpack_require__(/*! ../core/util/Sounds.js */ "./src/core/util/Sounds.js");
var AssetsUtil = __webpack_require__(/*! ../core/util/AssetsUtil.js */ "./src/core/util/AssetsUtil.js");
var StudentLink = __webpack_require__(/*! ../core/view/StudentLink.jsx */ "./src/core/view/StudentLink.jsx");
var URLMake = __webpack_require__(/*! ../../shared/URLMake.js */ "./shared/URLMake.js");
var _require = __webpack_require__(/*! ../core/vault/Derived.js */ "./src/core/vault/Derived.js"),
  percentLibraryChapterRead = _require.percentLibraryChapterRead;
var PartialProgressBar = __webpack_require__(/*! ../core/view/PartialProgressBar.jsx */ "./src/core/view/PartialProgressBar.jsx");
var Checkmark = __webpack_require__(/*! ../core/view/Checkmark.jsx */ "./src/core/view/Checkmark.jsx");
var styles = __webpack_require__(/*! ./styles/ChapterTile.css */ "./src/library/styles/ChapterTile.css");
module.exports = createReactClass({
  displayName: "LibraryChapterTile",
  propTypes: {
    gradeNumber: PT.number,
    displayName: PT.string,
    chapterIndex: PT.number,
    bookHash: PT.string,
    chapterModel: PT.object,
    demo: PT.bool,
    demoHighlight: PT.bool
  },
  onClick: function onClick() {
    Sounds.playSound("lesson-click");
  },
  renderUnfinishedIcon: function renderUnfinishedIcon() {
    var _this$props = this.props,
      chapterModel = _this$props.chapterModel,
      demo = _this$props.demo;
    var percentComplete = percentLibraryChapterRead(chapterModel, demo);
    if (percentComplete > 0) {
      if (percentComplete === 1) {
        // It shouldn't come here unless there was some bad recording of when all pages are read in the database.
        return this.renderCompleteIcon();
      } else {
        return /*#__PURE__*/React.createElement(PartialProgressBar, {
          className: styles.progressBar,
          percentComplete: percentComplete
        });
      }
    } else {
      return null;
    }
  },
  // Checkmark for completely read chapter
  renderCompleteIcon: function renderCompleteIcon() {
    return /*#__PURE__*/React.createElement(Checkmark, {
      colorName: "yellow",
      className: styles.check
    });
  },
  render: function render() {
    var _this$props2 = this.props,
      gradeNumber = _this$props2.gradeNumber,
      displayName = _this$props2.displayName,
      chapterIndex = _this$props2.chapterIndex,
      bookHash = _this$props2.bookHash,
      chapterModel = _this$props2.chapterModel;
    var shape = QuadUtil.getBookChapterSet(chapterIndex % 4);
    var backgroundClass = styles["grade" + gradeNumber + "Block"];
    var borderClass = styles["grade" + gradeNumber + "BlockBorder"];
    var quad = /*#__PURE__*/React.createElement("div", {
      className: styles.tileQuad
    }, /*#__PURE__*/React.createElement(Quad, {
      quad: shape,
      backgroundClass: backgroundClass,
      borderClass: borderClass,
      svgClass: styles.quadSvg,
      borderWidths: [0.33, 0, 0, 0.25],
      borderUnits: "rem",
      shadowOffset: 5,
      shadowOpacity: 0.4
    }));
    var chapterNumber = chapterIndex + 1;
    var tileStyle = this.props.demoHighlight ? styles.demoHighlight : styles.tile;
    return /*#__PURE__*/React.createElement("div", {
      className: tileStyle,
      onClick: this.onClick
    }, /*#__PURE__*/React.createElement(StudentLink, {
      to: URLMake.forLibraryFromNumbers(gradeNumber, chapterIndex),
      className: styles.tileInner,
      useWonkyCursor: true
    }, quad, /*#__PURE__*/React.createElement("img", {
      className: styles.tileImg,
      src: AssetsUtil.getChapterCover(bookHash, chapterNumber)
    }), /*#__PURE__*/React.createElement("div", {
      className: styles.chapterTitle
    }, chapterNumber + ": " + displayName), chapterModel.isCompletelyRead ? this.renderCompleteIcon() : this.renderUnfinishedIcon()));
  }
});

/***/ },

/***/ "./src/library/LibraryIcon.jsx"
/*!*************************************!*\
  !*** ./src/library/LibraryIcon.jsx ***!
  \*************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var styles = __webpack_require__(/*! ./styles/LibraryIcon.css */ "./src/library/styles/LibraryIcon.css");
var LibraryIcon = function LibraryIcon(props) {
  var type = props.type,
    className = props.className,
    isDisabled = props.isDisabled,
    clickHandler = props.clickHandler;
  var icon;
  var mainClass = isDisabled ? styles.disabled : styles.main;
  var colorClass = styles.color;
  var bgColorClass = styles.bgColor;
  if (className) mainClass += " " + className;
  if (isDisabled) colorClass = styles.disabledColor;
  if (type === "zoom-in") {
    icon = /*#__PURE__*/React.createElement("polygon", {
      className: colorClass,
      points: "31.3,22.4 22.6,22.7 22.4,32 18,31.7 17.7,22.9 9.2,23.2 8.4,17.6 17.5,17.8 17.2,9.6 22.8,8.8 22.6,17.8 31.6,18 "
    });
  } else if (type === "zoom-out") {
    icon = /*#__PURE__*/React.createElement("polygon", {
      className: colorClass,
      points: "31.3,22.4 9.2,23.2 8.4,17.6 31.6,18 "
    });
  } else if (type === "book") {
    icon = /*#__PURE__*/React.createElement("path", {
      transform: "translate(7,7) scale(0.88,0.88)",
      className: colorClass,
      d: "M29.1,4.8c0,0-7-4.7-14.1-0.1c0,0-2-3.5-13.9-1.9c0,0,0.7,12.8-0.7,22.9c0,0,12.1-2.3,14.6,2.2 c0,0,5.5-5.8,14.5-1.1C29.5,26.8,30,14.7,29.1,4.8z M4.2,12.3c4.8-0.7,7.7,0.6,8.7,1.2l0,1.9c-3.1-1.3-8-1-8.6-1L4.2,12.3z M12.9,7.2l0,2C9.2,8.1,5.4,8.5,4.1,8.7l0-2.7C7.8,5.6,11.5,6.7,12.9,7.2z M3.9,21.9l0.3-3.2c3.7-0.4,7.4,0.5,8.6,1l0,2.4 C9.3,20.8,5.4,21.6,3.9,21.9z M17.5,13.3c1.4-0.4,4.6-1,9.3-0.1l-0.1,2.1c-1.7-0.3-6-0.7-9.2-0.2L17.5,13.3z M27,7L26.9,9 c0,0-4.7-1.1-9.5-0.1l-0.1-2C20.4,5.3,23.2,6.3,27,7z M17.8,21.9l-0.1-1.9c1.5-0.4,5.2-1.2,8.9-0.7l-0.1,2.5 C25.2,21.5,21.5,21,17.8,21.9z"
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: mainClass,
    onClick: clickHandler
  }, /*#__PURE__*/React.createElement("svg", {
    className: styles.svg,
    version: "1.1",
    x: "0px",
    y: "0px",
    viewBox: "0 0 40 40",
    width: "40",
    height: "40",
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("polygon", {
    className: bgColorClass,
    points: "34.1,6.9 21.3,0.5 6.1,7.1 0.5,19.4 5.2,35.2 20.3,39.5 35.7,32.1 39.5,19 "
  }), icon));
};
LibraryIcon.propTypes = {
  type: PT.oneOf(["zoom-in", "zoom-out", "book"]),
  className: PT.string,
  isDisabled: PT.bool,
  clickHandler: PT.func
};
module.exports = LibraryIcon;

/***/ },

/***/ "./src/library/LibraryLessonButton.jsx"
/*!*********************************************!*\
  !*** ./src/library/LibraryLessonButton.jsx ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var Quad = __webpack_require__(/*! ../core/view/Quad.jsx */ "./src/core/view/Quad.jsx");
var QuadUtil = __webpack_require__(/*! ../core/util/QuadUtil.js */ "./src/core/util/QuadUtil.js");
var BlockStar = __webpack_require__(/*! ../trainer/reactView/BlockStar.jsx */ "./src/trainer/reactView/BlockStar.jsx");
var AssetsUtil = __webpack_require__(/*! ../core/util/AssetsUtil.js */ "./src/core/util/AssetsUtil.js");
var PartialProgressCircle = __webpack_require__(/*! ../core/view/PartialProgressCircle.jsx */ "./src/core/view/PartialProgressCircle.jsx");
var StudentLink = __webpack_require__(/*! ../core/view/StudentLink.jsx */ "./src/core/view/StudentLink.jsx");
var TrainerCore = __webpack_require__(/*! ../../shared/TrainerCore.js */ "./shared/TrainerCore.js");
var URLMake = __webpack_require__(/*! ../../shared/URLMake.js */ "./shared/URLMake.js");
var GradeChapter = __webpack_require__(/*! ../../shared/GradeChapter.js */ "./shared/GradeChapter.js");
var styles = __webpack_require__(/*! ./styles/LibraryLessonButton.css */ "./src/library/styles/LibraryLessonButton.css");
module.exports = createReactClass({
  displayName: "LibraryLessonButton",
  propTypes: {
    shapeNumber: PT.number.isRequired,
    gradeNumber: PT.number.isRequired,
    setModalInfo: PT.func.isRequired,
    model: PT.object.isRequired,
    user: PT.object.isRequired
  },
  render: function render() {
    var _this$props = this.props,
      shapeNumber = _this$props.shapeNumber,
      gradeNumber = _this$props.gradeNumber,
      model = _this$props.model,
      setModalInfo = _this$props.setModalInfo;
    var quad = QuadUtil.getLibraryLessonLinkSet(shapeNumber % 3);
    var locked = !model.unlocked;
    var requirementLevel = model.requirementLevel;
    var isBonus = TrainerCore.isBonusBlock(requirementLevel);
    var backgroundClass = locked ? styles.lessonButtonBackgroundLocked : styles["grade" + gradeNumber + "ButtonBackground"];
    var statusSymbol;
    if (locked) {
      statusSymbol = /*#__PURE__*/React.createElement("img", {
        className: styles.lockIcon,
        src: AssetsUtil.getButton("lock2")
      });
    } else if (model.percentComplete && model.percentComplete < 1) {
      statusSymbol = /*#__PURE__*/React.createElement(PartialProgressCircle, {
        className: styles.unfinished,
        percentComplete: model.percentComplete,
        shadowOffset: 2
      });
    } else {
      statusSymbol = /*#__PURE__*/React.createElement(BlockStar, {
        className: styles.star,
        type: "star-" + model.starsObtained,
        clickSound: "squishy",
        onClick: function onClick() {}
      });
    }
    var shadowClass = locked ? null : styles["grade" + gradeNumber + "ButtonShadow"];
    var lessonTitlePaddingClass = isBonus ? styles.lessonTitleBonusPadding : styles.lessonTitlePadding;
    var lessonTitleClass = "".concat(styles.lessonTitle, " ").concat(lessonTitlePaddingClass);
    var bonusIcon = isBonus ? /*#__PURE__*/React.createElement("img", {
      className: styles.titleIcon,
      src: AssetsUtil.getGeneralIcon("icon-bonus-beast")
    }) : null;
    if (model.unlocked === false) {
      var messageType = model.lockOverride ? "manuallyLocked" : "autoLocked";
      var chapterID = model.chapterID;
      var _GradeChapter$chapter = GradeChapter.chapterIDToContext(chapterID),
        chapterIndex = _GradeChapter$chapter.chapterIndex;
      var clickIntoLocked = function clickIntoLocked() {
        setModalInfo({
          messageType: messageType,
          gradeNumber: gradeNumber,
          chapterIndex: chapterIndex
        });
      };
      return /*#__PURE__*/React.createElement("div", {
        className: styles.blockButton
      }, /*#__PURE__*/React.createElement("div", {
        className: styles.lockedButtonContainer,
        onClick: clickIntoLocked
      }, /*#__PURE__*/React.createElement(Quad, {
        quad: quad,
        backgroundClass: backgroundClass,
        shadowOffset: 4,
        shadowOpacity: 0.5,
        shadowClass: shadowClass,
        svgClass: styles.buttonQuad
      }), /*#__PURE__*/React.createElement("div", {
        className: styles.titleWrapper
      }, bonusIcon, /*#__PURE__*/React.createElement("div", {
        className: lessonTitleClass
      }, model.displayName)), statusSymbol));
    } else {
      return /*#__PURE__*/React.createElement("div", {
        className: styles.blockButton
      }, /*#__PURE__*/React.createElement(StudentLink, {
        to: URLMake.forBlock({
          model: model
        }),
        useWonkyCursor: true
      }, /*#__PURE__*/React.createElement(Quad, {
        quad: quad,
        backgroundClass: backgroundClass,
        shadowOffset: 4,
        shadowOpacity: 0.5,
        shadowClass: shadowClass,
        svgClass: styles.buttonQuad
      }), /*#__PURE__*/React.createElement("div", {
        className: styles.titleWrapper
      }, bonusIcon, /*#__PURE__*/React.createElement("div", {
        className: lessonTitleClass
      }, model.displayName)), statusSymbol));
    }
  }
});

/***/ },

/***/ "./src/library/PageLibraryChapter.jsx"
/*!********************************************!*\
  !*** ./src/library/PageLibraryChapter.jsx ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var withVaultDispatch = __webpack_require__(/*! ../core/hoc/withVaultDispatch.jsx */ "./src/core/hoc/withVaultDispatch.jsx");
var withVaultUpdate = __webpack_require__(/*! ../core/hoc/withVaultUpdate.jsx */ "./src/core/hoc/withVaultUpdate.jsx");
var AT = __webpack_require__(/*! ../core/vault/ActionTypes.js */ "./src/core/vault/ActionTypes.js");
var Derived = __webpack_require__(/*! ../core/vault/Derived.js */ "./src/core/vault/Derived.js");
var _require = __webpack_require__(/*! ../core/vault/StateCursors.js */ "./src/core/vault/StateCursors.js"),
  atDemo = _require.atDemo,
  atUser = _require.atUser,
  atLibraryChaptersByGrade = _require.atLibraryChaptersByGrade;
var ErrorUtil = __webpack_require__(/*! ../../shared/ErrorUtil.js */ "./shared/ErrorUtil.js");
var Sounds = __webpack_require__(/*! ../core/util/Sounds.js */ "./src/core/util/Sounds.js");
var LoadGuard = __webpack_require__(/*! ../core/view/LoadGuard.jsx */ "./src/core/view/LoadGuard.jsx");
var TopBar = __webpack_require__(/*! ../core/view/TopBar.jsx */ "./src/core/view/TopBar.jsx");
var BookChapter = __webpack_require__(/*! ./BookChapter.jsx */ "./src/library/BookChapter.jsx");
var GradeChapter = __webpack_require__(/*! ../../shared/GradeChapter.js */ "./shared/GradeChapter.js");
var ReactPageTrainerError = __webpack_require__(/*! ../core/view/ReactPageTrainerError.jsx */ "./src/core/view/ReactPageTrainerError.jsx");
var styles = __webpack_require__(/*! ./styles/PageLibraryChapter.css */ "./src/library/styles/PageLibraryChapter.css");
var getChapterIDFromProps = function getChapterIDFromProps(props) {
  return GradeChapter.toChapterID(props.gradeNumber, props.chapterIndex);
};

// Helper to apply higher-order components.
var augment = function augment(Component) {
  Component = withVaultDispatch(Component);
  Component = withVaultUpdate(Component, function (props, vaultState) {
    var user = atUser(vaultState).get();
    var chapterID = getChapterIDFromProps(props);
    var libraryPages = Derived.getLibraryPagesForChapter(vaultState, chapterID);
    var chapters;
    if (props.demo) {
      chapters = Derived.getDemoLibraryChapters(vaultState, chapterID);
    } else {
      chapters = atLibraryChaptersByGrade(vaultState, props.gradeNumber).get();
    }
    return {
      user: user,
      chapters: chapters,
      libraryPages: libraryPages,
      demoTutorialShown: atDemo(vaultState).getIn("showing")
    };
  });
  return Component;
};
module.exports = augment(createReactClass({
  displayName: "PageLibraryChapter",
  propTypes: {
    gradeNumber: PT.number.isRequired,
    chapterIndex: PT.number.isRequired,
    sectionIndex: PT.number,
    pageNumber: PT.number,
    demo: PT.bool,
    // Injected by HOCs
    dispatch: PT.func.isRequired,
    demoTutorialShown: PT.string,
    user: PT.object.isRequired,
    chapters: PT.object.isRequired,
    libraryPages: PT.object
  },
  getInitialState: function getInitialState() {
    return {
      reactCrashed: false,
      reactCrashOutOfMemory: false
    };
  },
  componentDidMount: function componentDidMount() {
    Sounds.stopMusic(true);
  },
  componentDidCatch: function componentDidCatch(error, info) {
    ErrorUtil.log("E_REACT_CRASH", error, {
      componentStack: info.componentStack
    });
    this.setState({
      reactCrashed: true,
      reactCrashOutOfMemory: error && error.message === "out of memory"
    });
  },
  renderBook: function renderBook() {
    var chapterID = getChapterIDFromProps(this.props);
    var propsToCopy = _.pick(this.props, ["gradeNumber", "chapterIndex", "sectionIndex", "pageNumber", "user", "libraryPages", "demo"]);
    if (!this.props.demo) {
      propsToCopy.showLessonLinks = true;
    }
    return /*#__PURE__*/React.createElement(BookChapter, _extends({}, propsToCopy, {
      chapterID: chapterID,
      chapter: this.props.chapters[chapterID],
      demoHighlight: !!this.props.demoTutorialShown
    }));
  },
  loadChapter: function loadChapter() {
    var _this$props = this.props,
      user = _this$props.user,
      gradeNumber = _this$props.gradeNumber;
    // T25484
    if (!user.userID) {
      ErrorUtil.log("E_LOAD_LIBRARY_NO_USER", "PageLibraryChapter " + JSON.stringify(user));
    }
    var chapterIDs = GradeChapter.getAllChaptersForGrade(gradeNumber) || [];
    if (chapterIDs.length > 0) {
      this.props.dispatch({
        type: AT.LOAD_LIBRARY_CHAPTERS_REQUEST,
        userID: this.props.user.userID,
        chapterIDs: chapterIDs
      });
    }
  },
  render: function render() {
    var _this$props2 = this.props,
      user = _this$props2.user,
      chapters = _this$props2.chapters;
    var chapterID = getChapterIDFromProps(this.props);
    var book;
    if (this.state.reactCrashed) {
      book = /*#__PURE__*/React.createElement(ReactPageTrainerError, {
        isReactCrash: true,
        outOfMemory: this.state.reactCrashOutOfMemory
      });
    } else {
      book = /*#__PURE__*/React.createElement(LoadGuard, {
        identifier: "libraryChapter" + chapterID,
        status: chapters,
        requestLoad: this.loadChapter,
        errorView: "refresh",
        loadingView: "logo",
        renderLoaded: this.renderBook
      });
    }
    return /*#__PURE__*/React.createElement("div", {
      className: styles.main
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.pageTop
    }, /*#__PURE__*/React.createElement(TopBar, {
      user: user,
      demo: this.props.demo,
      isExpandable: true
    })), /*#__PURE__*/React.createElement("div", {
      className: styles.bgArgyle
    }), book);
  }
}));

/***/ },

/***/ "./src/library/PageLibraryGrade.jsx"
/*!******************************************!*\
  !*** ./src/library/PageLibraryGrade.jsx ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var _require = __webpack_require__(/*! ../core/view/PortalDestination.tsx */ "./src/core/view/PortalDestination.tsx"),
  PortalDestination = _require.PortalDestination;
var _require2 = __webpack_require__(/*! ../../shared/PortalConstants.ts */ "./shared/PortalConstants.ts"),
  PORTAL_CONTAINERS = _require2.PORTAL_CONTAINERS;
var withVaultDispatch = __webpack_require__(/*! ../core/hoc/withVaultDispatch.jsx */ "./src/core/hoc/withVaultDispatch.jsx");
var withVaultUpdate = __webpack_require__(/*! ../core/hoc/withVaultUpdate.jsx */ "./src/core/hoc/withVaultUpdate.jsx");
var AT = __webpack_require__(/*! ../core/vault/ActionTypes.js */ "./src/core/vault/ActionTypes.js");
var Derived = __webpack_require__(/*! ../core/vault/Derived.js */ "./src/core/vault/Derived.js");
var _require3 = __webpack_require__(/*! ../core/vault/StateCursors.js */ "./src/core/vault/StateCursors.js"),
  atDemo = _require3.atDemo,
  atUser = _require3.atUser,
  atLibraryChaptersByGrade = _require3.atLibraryChaptersByGrade;
var URLMake = __webpack_require__(/*! ../../shared/URLMake.js */ "./shared/URLMake.js");
var AssetsUtil = __webpack_require__(/*! ../core/util/AssetsUtil.js */ "./src/core/util/AssetsUtil.js");
var BookstoreUtil = __webpack_require__(/*! ../../shared/BookstoreUtil.js */ "./shared/BookstoreUtil.js");
var ErrorUtil = __webpack_require__(/*! ../../shared/ErrorUtil.js */ "./shared/ErrorUtil.js");
var _require4 = __webpack_require__(/*! ../core/util/GlobalFlags.js */ "./src/core/util/GlobalFlags.js"),
  FLAGS = _require4.FLAGS;
var Sounds = __webpack_require__(/*! ../core/util/Sounds.js */ "./src/core/util/Sounds.js");
var tooltipText = (__webpack_require__(/*! ../core/util/CopyTable.js */ "./src/core/util/CopyTable.js").tooltipText);
var ChapterTile = __webpack_require__(/*! ./ChapterTile.jsx */ "./src/library/ChapterTile.jsx");
var CircleButton = __webpack_require__(/*! ../core/view/CircleButton.jsx */ "./src/core/view/CircleButton.jsx");
var GeneralPageWrapper = __webpack_require__(/*! ../core/view/GeneralPageWrapper.jsx */ "./src/core/view/GeneralPageWrapper.jsx");
var GradeModal = __webpack_require__(/*! ../core/view/GradeModal.jsx */ "./src/core/view/GradeModal.jsx");
var LoadGuard = __webpack_require__(/*! ../core/view/LoadGuard.jsx */ "./src/core/view/LoadGuard.jsx");
var ReactPageTrainerError = __webpack_require__(/*! ../core/view/ReactPageTrainerError.jsx */ "./src/core/view/ReactPageTrainerError.jsx");
var ScrollArea = __webpack_require__(/*! ../core/view/ScrollArea.jsx */ "./src/core/view/ScrollArea.jsx");
var TitleBar = __webpack_require__(/*! ../core/view/TitleBar.jsx */ "./src/core/view/TitleBar.jsx");
var Tooltip = __webpack_require__(/*! ../core/view/Tooltip.jsx */ "./src/core/view/Tooltip.jsx");
var TopBar = __webpack_require__(/*! ../core/view/TopBar.jsx */ "./src/core/view/TopBar.jsx");
var chapterNames = (__webpack_require__(/*! ../../shared/data/dbOnlineBooks.json */ "./shared/data/dbOnlineBooks.json").chapterNames);
var GradeChapter = __webpack_require__(/*! ../../shared/GradeChapter.js */ "./shared/GradeChapter.js");
var dbDemoData = __webpack_require__(/*! ../../shared/data/dbDemoData.json */ "./shared/data/dbDemoData.json");
var styles = __webpack_require__(/*! ./styles/PageLibraryGrade.css */ "./src/library/styles/PageLibraryGrade.css");

// Helper to apply higher-order components.
var augment = function augment(Component) {
  Component = withVaultDispatch(Component);
  Component = withVaultUpdate(Component, function (props, vaultState) {
    var user = atUser(vaultState).get();
    if (props.demo) {
      return {
        user: user,
        chapters: Derived.getDemoLibraryChapters(vaultState),
        demoTutorialShown: atDemo(vaultState).getIn("showing")
      };
    } else {
      return {
        user: user,
        chapters: atLibraryChaptersByGrade(vaultState, props.gradeNumber).get(),
        demoTutorialShown: null
      };
    }
  });
  return Component;
};
module.exports = augment(createReactClass({
  displayName: "PageLibraryGrade",
  propTypes: {
    gradeNumber: PT.number,
    demo: PT.bool,
    // Injected by HOCs
    dispatch: PT.func.isRequired,
    user: PT.object.isRequired,
    chapters: PT.object.isRequired,
    demoTutorialShown: PT.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      gradeNumber: 3
    };
  },
  // Used by vault update HOC
  vaultEvents: {
    showGradeModal: function showGradeModal() {
      this.setState({
        isGradeModalOpen: true
      });
    }
  },
  getInitialState: function getInitialState() {
    return {
      isGradeModalOpen: false,
      reactCrashed: false,
      reactCrashOutOfMemory: false
    };
  },
  componentDidMount: function componentDidMount() {
    // TODO: If we ever have status circles on chapters,
    // we might need this in a LoadGuard
    this.loadLibraryChapters();
    this.loadAdjacentGrades();
    Sounds.playMusic("general-background");
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    if (this.props.gradeNumber !== prevProps.gradeNumber) {
      this.loadLibraryChapters();
      if (!this.props.demo) this.loadAdjacentGrades();
    }
  },
  componentDidCatch: function componentDidCatch(error, info) {
    ErrorUtil.log("E_REACT_CRASH", error, {
      componentStack: info.componentStack
    });
    this.setState({
      reactCrashed: true,
      reactCrashOutOfMemory: error && error.message === "out of memory"
    });
  },
  loadLibraryChapters: function loadLibraryChapters() {
    var _this$props = this.props,
      demo = _this$props.demo,
      gradeNumber = _this$props.gradeNumber,
      user = _this$props.user;
    if (!demo) {
      // T25484
      if (!user.userID) {
        ErrorUtil.log("E_LOAD_LIBRARY_NO_USER", "PageLibraryGrade " + JSON.stringify(user));
      }
      var chapterIDs = GradeChapter.getAllChaptersForGrade(gradeNumber) || [];
      if (chapterIDs.length > 0) {
        this.props.dispatch({
          type: AT.LOAD_LIBRARY_CHAPTERS_REQUEST,
          userID: user.userID,
          chapterIDs: chapterIDs
        });
      }
    }
  },
  getAvailableGrades: function getAvailableGrades() {
    var grades = FLAGS.accessUnfinishedGrades ? BookstoreUtil.getAvailableGradeNumbers() : GradeChapter.getActiveGrades();
    return grades;
  },
  loadAdjacentGrades: function loadAdjacentGrades() {
    var gradeNumber = this.props.gradeNumber;
    var userID = this.props.user.userID;
    var availableGrades = this.getAvailableGrades();
    var prevGradeNumber = _.includes(availableGrades, gradeNumber - 1) ? gradeNumber - 1 : null;
    var nextGradeNumber = _.includes(availableGrades, gradeNumber + 1) ? gradeNumber + 1 : null;
    if (prevGradeNumber && this.lastPreviousGrade !== prevGradeNumber) {
      this.lastPreviousGrade = prevGradeNumber;
      this.props.dispatch({
        type: AT.LOAD_LIBRARY_CHAPTERS_ANTICIPATED_REQUEST,
        userID: userID,
        chapterIDs: GradeChapter.getAllChaptersForGrade(prevGradeNumber)
      });
    }
    if (nextGradeNumber && this.lastNextGrade !== nextGradeNumber) {
      this.lastNextGrade = nextGradeNumber;
      this.props.dispatch({
        type: AT.LOAD_LIBRARY_CHAPTERS_ANTICIPATED_REQUEST,
        userID: userID,
        chapterIDs: GradeChapter.getAllChaptersForGrade(nextGradeNumber)
      });
    }
  },
  makeBookTile: function makeBookTile(bookHash) {
    return /*#__PURE__*/React.createElement("div", {
      className: styles.bookTile
    }, /*#__PURE__*/React.createElement("img", {
      className: styles.bookImg,
      src: AssetsUtil.getBookCover(bookHash)
    }), /*#__PURE__*/React.createElement("img", {
      className: styles.bookIcon,
      src: AssetsUtil.getBookIcon(bookHash)
    }));
  },
  makeChapterTile: function makeChapterTile(displayName, chapterIndex, bookHash) {
    var gradeNumber = parseInt(bookHash);
    var chapterID = GradeChapter.toChapterID(gradeNumber, chapterIndex);
    return /*#__PURE__*/React.createElement(ChapterTile, {
      key: "tile" + chapterIndex,
      gradeNumber: gradeNumber,
      displayName: displayName,
      chapterIndex: chapterIndex,
      bookHash: bookHash,
      chapterModel: this.props.chapters[chapterID].model,
      demo: this.props.demo,
      demoHighlight: this.props.demoTutorialShown === "libraryGrade" && bookHash === "2A"
    });
  },
  makeRowFromBookHash: function makeRowFromBookHash(bookHash) {
    var bookChapters = BookstoreUtil.getChapterNumbersByBookHash(bookHash);
    if (!bookChapters) {
      return null;
    }
    var chapterInfo = bookChapters === null || bookChapters === void 0 ? void 0 : bookChapters.map(function (c) {
      return {
        chapterNumber: c,
        bookHash: bookHash
      };
    });
    var chapterTiles = this.makeChapterTiles(chapterInfo);
    return /*#__PURE__*/React.createElement("div", {
      className: styles.row,
      key: "row" + bookHash
    }, this.makeBookTile(bookHash), chapterTiles);
  },
  makeChapterTiles: function makeChapterTiles(chapterInfo) {
    var _this = this;
    var chapterTiles = chapterInfo.map(function (ci) {
      var gradeNumber = parseInt(ci.bookHash);
      var chapterIndex = ci.chapterNumber - 1;
      return _this.makeChapterTile(chapterNames[gradeNumber][chapterIndex], chapterIndex, ci.bookHash);
    });
    return chapterTiles;
  },
  makeRowForDemo: function makeRowForDemo(gradeNumber) {
    var chapterInfo = dbDemoData.libraryChapterRowData[gradeNumber];
    var chapterTiles = this.makeChapterTiles(chapterInfo);
    return /*#__PURE__*/React.createElement("div", {
      className: styles.row,
      key: "row" + gradeNumber
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.gradeIconWrapper
    }, /*#__PURE__*/React.createElement("img", {
      className: styles.gradeIcon,
      src: AssetsUtil.getImageForGrade(gradeNumber, "demo")
    })), chapterTiles);
  },
  renderLoaded: function renderLoaded() {
    if (this.state.reactCrashed) {
      return /*#__PURE__*/React.createElement(ReactPageTrainerError, {
        isReactCrash: true,
        outOfMemory: this.state.reactCrashOutOfMemory
      });
    }
    var bookRows;
    if (this.props.demo) {
      bookRows = /*#__PURE__*/React.createElement(ScrollArea, {
        hasXScroll: false,
        noFade: true,
        areaStyle: {
          overflow: "hidden"
        }
      }, this.getAvailableGrades().map(this.makeRowForDemo));
    } else {
      bookRows = BookstoreUtil.getGradeHashSequence(this.props.gradeNumber, {
        excludeTypes: ["puzzle"]
      }).map(this.makeRowFromBookHash);
    }
    return /*#__PURE__*/React.createElement("div", {
      className: styles.content
    }, bookRows);
  },
  render: function render() {
    var _this2 = this;
    var _this$props2 = this.props,
      user = _this$props2.user,
      grade = _this$props2.gradeNumber,
      chapters = _this$props2.chapters,
      demo = _this$props2.demo;
    var styleColor = demo ? "demo" : "grade" + grade;
    var bookRows;
    if (demo) {
      bookRows = this.renderLoaded();
    } else {
      bookRows = /*#__PURE__*/React.createElement(LoadGuard, {
        identifier: "libraryGrade" + grade,
        status: chapters,
        requestLoad: this.loadLibraryChapters,
        errorView: "refresh",
        loadingView: "logo",
        renderLoaded: this.renderLoaded
      });
    }
    var availableGrades = this.getAvailableGrades();
    var prevGradeURL, prevGradeTooltip, nextGradeURL, nextGradeTooltip;
    if (!demo && _.includes(availableGrades, grade - 1)) {
      prevGradeURL = URLMake.forLibraryFromNumbers(grade - 1);
      prevGradeTooltip = "".concat(grade - 1, "A - ").concat(grade - 1, "D");
    }
    if (!demo && _.includes(availableGrades, grade + 1)) {
      nextGradeURL = URLMake.forLibraryFromNumbers(grade + 1);
      nextGradeTooltip = "".concat(grade + 1, "A - ").concat(grade + 1, "D");
    }
    var gradeModal = null;
    if (this.state.isGradeModalOpen) {
      gradeModal = /*#__PURE__*/React.createElement(GradeModal, {
        onClose: function onClose() {
          return _this2.setState({
            isGradeModalOpen: false
          });
        },
        forLibrary: true,
        user: user
      });
    }
    var leftIcon = demo ? null : /*#__PURE__*/React.createElement(Tooltip, {
      tooltipText: tooltipText.gradeLibraryButton,
      size: "medium",
      stretchWidth: true,
      direction: "bottom-left",
      className: styles.titleBarButtonTooltip
    }, /*#__PURE__*/React.createElement(CircleButton, {
      className: styles.circleButton,
      buttonType: "titleBar",
      buttonClass: styles.indexButton,
      imageSrc: AssetsUtil.getTrainerIconButton("index-demo"),
      imageSize: 2.5,
      clickSound: "lesson-menu",
      handleClick: function handleClick() {
        return _this2.setState({
          isGradeModalOpen: true
        });
      }
    }));
    return /*#__PURE__*/React.createElement(GeneralPageWrapper, {
      styleColor: styleColor,
      gradeNumber: grade,
      leftNavURL: prevGradeURL,
      rightNavURL: nextGradeURL,
      leftNavTooltip: prevGradeTooltip,
      rightNavTooltip: nextGradeTooltip,
      navTooltipProps: {
        size: "small"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.pageTop
    }, /*#__PURE__*/React.createElement(TitleBar, {
      text: "Library",
      styleColor: styleColor
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.titleBarButtons
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.titleBarButtonsLeft
    }, leftIcon))), /*#__PURE__*/React.createElement(TopBar, {
      user: user,
      demo: this.props.demo
    })), /*#__PURE__*/React.createElement(PortalDestination, {
      name: PORTAL_CONTAINERS.DEMO_TUTORIAL_MODAL
    }), bookRows, gradeModal);
  }
}));

/***/ },

/***/ "./src/library/main.js"
/*!*****************************!*\
  !*** ./src/library/main.js ***!
  \*****************************/
(module, __unused_webpack_exports, __webpack_require__) {

var AT = __webpack_require__(/*! ../core/vault/ActionTypes.js */ "./src/core/vault/ActionTypes.js");
var UpdateLibrary = __webpack_require__(/*! ./vault/UpdateLibrary.js */ "./src/library/vault/UpdateLibrary.js");
var initialize = function initialize(vault, updater) {
  UpdateLibrary.augment(updater);
  vault.dispatchNow({
    type: AT.LIBRARY_INITIAL
  });
};
module.exports = {
  initialize: initialize,
  PageLibraryGrade: __webpack_require__(/*! ./PageLibraryGrade.jsx */ "./src/library/PageLibraryGrade.jsx"),
  PageLibraryChapter: __webpack_require__(/*! ./PageLibraryChapter.jsx */ "./src/library/PageLibraryChapter.jsx"),
  BookChapterModal: __webpack_require__(/*! ./BookChapterModal.jsx */ "./src/library/BookChapterModal.jsx"),
  BookChapter: __webpack_require__(/*! ./BookChapter.jsx */ "./src/library/BookChapter.jsx")
};

/***/ },

/***/ "./src/library/util/SectionUtil.js"
/*!*****************************************!*\
  !*** ./src/library/util/SectionUtil.js ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var Books = __webpack_require__(/*! ../../../shared/data/dbOnlineBooks.json */ "./shared/data/dbOnlineBooks.json");
var ChapterSection = __webpack_require__(/*! ../../../shared/ChapterSection.js */ "./shared/ChapterSection.js");
var dbDemoData = __webpack_require__(/*! ../../../shared/data/dbDemoData.json */ "./shared/data/dbDemoData.json");
var ContainerSize = __webpack_require__(/*! ../../core/util/ContainerSize.js */ "./src/core/util/ContainerSize.js");
var PAGE_RATIO = 0.816; // width/height
var PADDING = 5; //match css padding between pages
var LESSON_LINKS_PER_ROW = 4; // number of lesson links in row before wrapping

// Returns array of objects describing each section in the chapter
// Used to calculate heights of each section
// id: section ID
// pages: array with first page and last page in section
// linkRows: how many rows of block links are shown below the section
var getHeightData = function getHeightData(chapterID, showSingleSection, sectionBlockMap, showLessonLinks, sectionIndex, demo) {
  var heightData = [];

  // This is used by the tutorial, since it isn't associated with any chapter
  if (chapterID === 0) {
    heightData.push({
      id: 0,
      pages: [1, 1],
      linkRows: 0
    });
    return heightData;
  }
  var chapterPageRange = ChapterSection.getChapterPages(chapterID, demo);
  var firstPage = chapterPageRange[0];
  var chapterSections = ChapterSection.getChapterSections(chapterID);
  var getRowCount = function getRowCount(sectionID) {
    if (showLessonLinks) {
      var lessons = sectionBlockMap[sectionID];
      var lessonCount = _.get(lessons, "length");
      return Math.ceil(lessonCount / LESSON_LINKS_PER_ROW);
    }
    return 0;
  };
  if (showSingleSection) {
    var sectionID = chapterSections[sectionIndex];
    heightData.push({
      id: sectionID,
      pages: ChapterSection.getChapterSectionPages(sectionID),
      linkRows: 0
    });
    return heightData;
  } else if (demo) {
    var sectionIDs = ChapterSection.getSectionsInPageRange(chapterID, chapterPageRange);
    _.each(sectionIDs, function (sectionID) {
      heightData.push({
        id: sectionID,
        pages: ChapterSection.getChapterSectionPages(sectionID),
        linkRows: 0
      });
    });
    return heightData;
  } else {
    // Add intro pages
    heightData.push({
      id: 0,
      pages: [firstPage, firstPage + 1],
      linkRows: getRowCount(0)
    });
  }
  _.each(chapterSections, function (sectionID) {
    heightData.push({
      id: sectionID,
      pages: ChapterSection.getChapterSectionPages(sectionID),
      linkRows: getRowCount(sectionID)
    });
  });
  return heightData;
};

// Get the sizes of the various book sections to be used in the scroll bar
var getSectionSizes = function getSectionSizes(heightData, fontSize, menuHeight, pageWidth, zoom) {
  // For demo or modal reading view, where we only have one section just
  // make a single section the whole height of the scroll bar
  if (heightData.length === 1) return {
    adjHeights: [menuHeight],
    chapterIntroPagesHeight: 0
  };
  var totalActualHeight = getTotalPagesHeight(heightData, pageWidth, zoom);
  var idealHeightsInMenu = [];
  var chapterIntroPagesHeight = 0;
  // Height it should be on scroll bar
  _.each(heightData, function (shd) {
    var sectionHeight = getSectionHeight(pageWidth, zoom, shd);
    var sectionMenuHeight = sectionHeight / totalActualHeight * menuHeight;
    if (shd.id === 0) {
      chapterIntroPagesHeight = sectionMenuHeight;
    } else {
      idealHeightsInMenu.push(sectionMenuHeight);
    }
  });

  // Min height that section needs to fit section display name
  var padding = fontSize * 0.5;
  var minHeight = fontSize + 2 * padding;
  // Adjusted heights so that each section has a min height
  var adjHeights = fitWithMinSize(idealHeightsInMenu, minHeight);
  return {
    adjHeights: adjHeights,
    chapterIntroPagesHeight: chapterIntroPagesHeight
  };
};

// From PM:
// Given a list of sizes, increase small items to a minimum size and
// proportionally shrink the remaining items.
var fitWithMinSize = function fitWithMinSize(sizes, minSize) {
  var n = sizes.length;
  var totalSize = _.sum(sizes);
  if (n * minSize >= totalSize) {
    return _.range(n).map(function () {
      return totalSize / n;
    });
  }
  // To find all items to bump to min size, go through all sizes in ascending
  // order, since there may be a domino effect where an item needs to be bumped
  // up to the minimum only after shrinking.
  var sortedPairs = _.sortBy(sizes.map(function (s, i) {
    return [i, s];
  }), function (x) {
    return x[1];
  });
  var sortedIndsUsingMin = 0;
  var nonMinTotalFinal = totalSize;
  var nonMinTotalRaw = totalSize;
  while (sortedPairs[sortedIndsUsingMin][1] * nonMinTotalFinal / nonMinTotalRaw < minSize) {
    nonMinTotalRaw -= sortedPairs[sortedIndsUsingMin][1];
    nonMinTotalFinal -= minSize;
    sortedIndsUsingMin += 1;
  }
  var finalSizes = _.range(n);
  for (var sortedInd = 0; sortedInd < n; sortedInd += 1) {
    var origInd = sortedPairs[sortedInd][0];
    if (sortedInd < sortedIndsUsingMin) {
      finalSizes[origInd] = minSize;
    } else {
      finalSizes[origInd] = sizes[origInd] * nonMinTotalFinal / nonMinTotalRaw;
    }
  }
  return finalSizes;
};

// Gets the total height of the lesson link area at the end of a section
var getLessonLinkHeight = function getLessonLinkHeight(rows) {
  var containerSize = ContainerSize.getContainerSizeFromWindow();
  var remHeight = ContainerSize.getRootFontSize(containerSize);
  // rows with 6.6rem height plus 2rem bottom margin
  return rows === 0 ? 0 : (6.6 * rows + 2) * remHeight;
};
var getPageHeight = function getPageHeight(pageWidth, zoom) {
  return pageWidth / PAGE_RATIO * zoom + 2 * PADDING;
};
var getSectionHeight = function getSectionHeight(pageWidth, zoom, sectionHeightData) {
  var pages = sectionHeightData.pages,
    linkRows = sectionHeightData.linkRows;
  var numPages = pages[1] - pages[0] + 1;
  return numPages * getPageHeight(pageWidth, zoom) + getLessonLinkHeight(linkRows);
};

// Gets the total height of all pages, including any lesson links
var getTotalPagesHeight = function getTotalPagesHeight(heightData, pageWidth, zoom) {
  var height = 0;
  _.each(heightData, function (sectionData) {
    height += getSectionHeight(pageWidth, zoom, sectionData);
  });
  return height;
};

// Gets the top y value for a given section
var getSectionPosition = function getSectionPosition(heightData, sectionID, pageWidth, zoom) {
  if (!sectionID || _.findIndex(heightData, function (hd) {
    return hd.id === sectionID;
  }) === -1) {
    return 0;
  }
  var sectionStart = 0;
  for (var sectionIndex = 0; sectionIndex < heightData.length; sectionIndex++) {
    var sectionData = heightData[sectionIndex];
    if (sectionData.id === sectionID) return sectionStart;
    sectionStart += getSectionHeight(pageWidth, zoom, sectionData);
  }
};

// Gets the top y value for a given page
var getPagePosition = function getPagePosition(heightData, pageNumber, pageWidth, zoom) {
  if (!pageNumber) {
    return 0;
  }
  // iterate through height data and
  var pageStart = 0;
  for (var hdi = 0; hdi < heightData.length; hdi++) {
    var hd = heightData[hdi];
    if (_.inRange(pageNumber, hd.pages[0], hd.pages[1] + 1)) {
      // add however many pages before it
      pageStart += (pageNumber - hd.pages[0]) * getPageHeight(pageWidth, zoom);
      return pageStart;
    } else {
      pageStart += getSectionHeight(pageWidth, zoom, hd);
    }
  }

  // Page not found
  return 0;
};

// Gets which page contains the given y position
var getPageFromPosition = function getPageFromPosition(heightData, position, pageWidth, zoom) {
  if (typeof position !== "number") {
    return null;
  }
  var currentLocation = 0;
  // Search through each section
  for (var sectionIndex = 0; sectionIndex < heightData.length; sectionIndex++) {
    var sectionData = heightData[sectionIndex];
    var sectionEndPos = currentLocation + getSectionHeight(pageWidth, zoom, sectionData);
    var pageHeight = getPageHeight(pageWidth, zoom);
    if (position < sectionEndPos) {
      // Search through each page in the section
      for (var page = sectionData.pages[0]; page <= sectionData.pages[1]; page++) {
        var pageEnd = currentLocation + pageHeight;
        // Check if position is within the current page
        // Use Math.floor to account for floating point precision issues
        if (position < Math.floor(pageEnd) || page === sectionData.pages[1]) {
          return page;
        } else {
          currentLocation = pageEnd;
        }
      }
    } else {
      currentLocation = sectionEndPos;
    }
  }

  // Default to last page to account for any space at the bottom
  return _.last(heightData).pages[1];
};
var getSectionIDFromBookPage = function getSectionIDFromBookPage(bookHash, pageNumber) {
  var bookChapters = Books.books[bookHash];
  var chapter = _.find(bookChapters, function (c) {
    var pages = Books.chapterPages[c];
    return _.inRange(pageNumber, pages[0], pages[1] + 1);
  });
  return _.find(Books.chapters[chapter], function (s) {
    var pages = Books.sections[s].page;
    return _.inRange(pageNumber, pages[0], pages[1] + 1);
  });
};
var getSectionCharacterFromBookPage = function getSectionCharacterFromBookPage(bookHash, pageNumber) {
  var section = getSectionIDFromBookPage(bookHash, pageNumber);
  if (section) {
    return Books.sections[section].character;
  } else {
    return null;
  }
};

// Gets an array with the first and last page in the section
var getSectionPages = function getSectionPages(sectionID) {
  return Books.sections[sectionID].page;
};

// Checks whether a given page is in the given chapter
var isPageInChapter = function isPageInChapter(chapterID, pageNumber, demo) {
  var pages = demo ? dbDemoData.chapterPages[chapterID] : Books.chapterPages[chapterID];
  return pages && pageNumber >= pages[0] && pageNumber <= pages[1];
};
var getPagesInChapter = function getPagesInChapter(chapterID) {
  var pages = Books.chapterPages[chapterID];
  return _.range(pages[0], pages[1] + 1);
};
module.exports = {
  getPageHeight: getPageHeight,
  getHeightData: getHeightData,
  getSectionSizes: getSectionSizes,
  getTotalPagesHeight: getTotalPagesHeight,
  getSectionPosition: getSectionPosition,
  getPagePosition: getPagePosition,
  getPageFromPosition: getPageFromPosition,
  getSectionIDFromBookPage: getSectionIDFromBookPage,
  getSectionCharacterFromBookPage: getSectionCharacterFromBookPage,
  getSectionPages: getSectionPages,
  isPageInChapter: isPageInChapter,
  getPagesInChapter: getPagesInChapter,
  PAGE_RATIO: PAGE_RATIO
};

/***/ },

/***/ "./src/library/vault/OpsLibraryPages.js"
/*!**********************************************!*\
  !*** ./src/library/vault/OpsLibraryPages.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var _require = __webpack_require__(/*! ../../../shared/ImmHelpers.js */ "./shared/ImmHelpers.js"),
  setIn = _require.setIn,
  extendIn = _require.extendIn;
var _require2 = __webpack_require__(/*! ../../../shared/ChapterSection.js */ "./shared/ChapterSection.js"),
  getBookHash = _require2.getBookHash;
var SectionUtil = __webpack_require__(/*! ../util/SectionUtil.js */ "./src/library/util/SectionUtil.js");
var ErrorUtil = __webpack_require__(/*! ../../../shared/ErrorUtil.js */ "./shared/ErrorUtil.js");
var LoadState = __webpack_require__(/*! ../../core/vault/util/LoadState.js */ "./src/core/vault/util/LoadState.js");

// Drop loaded pages once we have more than this loaded.
var LOADED_PAGES_LIMIT = 10;

// Retry loading a page with an unrecognized error up to this many times.
var LOAD_PAGE_ERROR_LIMIT = 2;

// Load pages +/- this from current, meaning 2*this+1 total can be loaded
var NEARBY_PAGES_TO_LOAD = 3;

// TODO: change all library things to use pageNumber instead of page

// Library pages shape {
//   chapterID,
//   currPageNumber: page user is viewing,
//   loadingPageNumber: page being loaded if any,
//   loadedPages: {
//     [pageNumber]: {
//       load,
//       loadError,
//       pageData: array of base64 images,
//       errorCount: number of times this failed to load,
//     },
//   },
// }
// This object has to be handled carefully since the pageData values are huge
// base64 images. We use initForChapter to only keep data for one chapter at a
// time, and we use pruneLoadedPages to not keep too many of its pages in
// memory at once.

// Basic internal helpers

var init = function init(chapterID, demo) {
  return {
    chapterID: chapterID,
    currPageNumber: null,
    loadingPageNumber: null,
    loadedPages: {},
    demo: demo
  };
};
var filterByInChapter = function filterByInChapter(lpages, pageNumList, demo) {
  return pageNumList.filter(function (p) {
    return SectionUtil.isPageInChapter(lpages.chapterID, p, demo);
  });
};
var sortPageNumbersByLoadPriority = function sortPageNumbersByLoadPriority(lpages, pageNumList) {
  // Effect here is sort priority of [n, n+1, n-1, n+2, n-2, n+3, n-3, ...].
  var adjCurr = lpages.currPageNumber + 0.25;
  return _.sortBy(pageNumList, function (a) {
    return Math.abs(a - adjCurr);
  });
};

// Basic exported functions

// Noop if the chapterID is the same as the current one.
var initForChapter = function initForChapter(lpages, chapterID, demo) {
  if (!lpages || lpages.chapterID !== chapterID) {
    return init(chapterID, demo);
  }
  return lpages;
};
var setPageNumber = function setPageNumber(lpages, currPageNumber) {
  lpages = setIn(lpages, "currPageNumber", currPageNumber);
  return lpages;
};
var getNextPageNumberToLoad = function getNextPageNumberToLoad(lpages, demo) {
  var pageNumList = _.range(lpages.currPageNumber - NEARBY_PAGES_TO_LOAD, lpages.currPageNumber + NEARBY_PAGES_TO_LOAD + 1);
  pageNumList = filterByInChapter(lpages, pageNumList, demo);
  pageNumList = pageNumList.filter(function (p) {
    var status = _.get(lpages, ["loadedPages", p, "load"]);
    return status !== "done" && status !== "error";
  });
  pageNumList = sortPageNumbersByLoadPriority(lpages, pageNumList);
  return pageNumList[0] || null;
};
var getDataForPageNumber = function getDataForPageNumber(lpages, pageNumber) {
  return initLoadedPage(lpages && lpages.loadedPages[pageNumber]);
};

//
// loadedPages functions
//

// Internal helpers for individual values of the loadedPages object.

var initLoadedPage = function initLoadedPage(loadedPage) {
  return loadedPage || LoadState.loadInit({
    pageData: null,
    errorCount: 0
  });
};

// Pass data through parseLoadedPages first.
var addDataToLoadedPage = function addDataToLoadedPage(loadedPage, pageData) {
  loadedPage = initLoadedPage(loadedPage);
  return extendIn(LoadState.loadSuccess(loadedPage), [], {
    pageData: pageData,
    errorCount: 0
  });
};
var addErrorToLoadedPage = function addErrorToLoadedPage(loadedPage, error) {
  // TODO: what to do for shouldRetry errors? Any other known ones?
  if (LoadState.shouldRetry(error)) {
    return loadedPage;
  }
  loadedPage = initLoadedPage(loadedPage);
  loadedPage = setIn(loadedPage, "errorCount", function (c) {
    return c + 1;
  });
  if (loadedPage.errorCount || 0 >= LOAD_PAGE_ERROR_LIMIT) {
    loadedPage = LoadState.loadError(loadedPage, error);
    loadedPage = setIn(loadedPage, "pageData", null);
  } else {
    loadedPage = LoadState.loadRestart(loadedPage);
  }
  return loadedPage;
};

// Internal. Converts object with bookHash-pageNumber-part keys to one with
// pageNumber keys and arrays of parts as values. (bookHash is ignored.)
var parseLoadedPages = function parseLoadedPages(data) {
  var ret = {};
  _.each(data, function (page, key) {
    var parts = key.split("-");
    if (!parts[1] || ret[parts[1]]) {
      return;
    }
    var start = parts[0] + "-" + parts[1] + "-";
    var i = 0;
    ret[parts[1]] = [];
    while (data[start + i]) {
      ret[parts[1]].push(data[start + i]);
      i += 1;
    }
  });
  return ret;
};

// Internal. Returns lpages with some keys of loadedPages removed if it is
// getting too large.
var pruneLoadedPages = function pruneLoadedPages(lpages) {
  var loadedNumbers = Object.keys(lpages.loadedPages).filter(function (p) {
    return !!_.get(lpages, ["loadedPages", p, "pageData"]);
  });
  if (loadedNumbers.length > LOADED_PAGES_LIMIT) {
    var pruneNumbers = sortPageNumbersByLoadPriority(lpages, loadedNumbers);
    pruneNumbers = pruneNumbers.slice(LOADED_PAGES_LIMIT);
    lpages = setIn(lpages, "loadedPages", function (lp) {
      return _.omit(lp, pruneNumbers);
    });
  }
  return lpages;
};

// Exported functions that actually alter loadedPages.

var loadPageStart = function loadPageStart(lpages, pageNumber, api) {
  if (!pageNumber || lpages.loadingPageNumber) {
    return lpages;
  }
  var bookHash = getBookHash(lpages.chapterID);
  if (!bookHash) {
    ErrorUtil.log("E_BAD_CHAPTER_ID", "Library tried to load pages for chapter " + lpages.chapterID + " which has no associated book");
    return lpages;
  }
  if (lpages.demo) {
    api.loadDemoLibraryPages(lpages.chapterID, bookHash, [pageNumber]);
  } else {
    api.loadLibraryPages(lpages.chapterID, bookHash, [pageNumber]);
  }
  lpages = setIn(lpages, "loadingPageNumber", pageNumber);
  lpages = setIn(lpages, ["loadedPages", pageNumber], function (lp) {
    lp = initLoadedPage(lp);
    lp = LoadState.loadPending(lp);
    return lp;
  });
  return lpages;
};

// loadPageStart but autocomputes the pageNumber to load. May noop.
var loadAutoPageStart = function loadAutoPageStart(lpages, api, demo) {
  var nextNumber = getNextPageNumberToLoad(lpages, demo);
  return loadPageStart(lpages, nextNumber, api);
};
var loadPageSuccess = function loadPageSuccess(lpages, data) {
  var pageDataTable = parseLoadedPages(data);
  var newLoadedPages = _.mapValues(pageDataTable, function (pageData, pageNumber) {
    return addDataToLoadedPage(lpages.loadedPages[pageNumber], pageData);
  });
  lpages = extendIn(lpages, [], {
    loadingPageNumber: null,
    loadedPages: extendIn(lpages.loadedPages, [], newLoadedPages)
  });
  lpages = pruneLoadedPages(lpages);
  return lpages;
};
var loadPageFail = function loadPageFail(lpages, pageNumbers, error) {
  var newLoadedPages = {};
  pageNumbers.forEach(function (pn) {
    newLoadedPages[pn] = addErrorToLoadedPage(lpages.loadedPages[pn], error);
  });
  lpages = extendIn(lpages, [], {
    loadingPageNumber: null,
    loadedPages: extendIn(lpages.loadedPages, [], newLoadedPages)
  });
  lpages = pruneLoadedPages(lpages);
  return lpages;
};
module.exports = {
  initForChapter: initForChapter,
  setPageNumber: setPageNumber,
  getNextPageNumberToLoad: getNextPageNumberToLoad,
  getDataForPageNumber: getDataForPageNumber,
  loadPageStart: loadPageStart,
  loadAutoPageStart: loadAutoPageStart,
  loadPageSuccess: loadPageSuccess,
  loadPageFail: loadPageFail
};

/***/ },

/***/ "./src/library/vault/UpdateLibrary.js"
/*!********************************************!*\
  !*** ./src/library/vault/UpdateLibrary.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var AT = __webpack_require__(/*! ../../core/vault/ActionTypes.js */ "./src/core/vault/ActionTypes.js");
var _require = __webpack_require__(/*! ../../../shared/ImmHelpers.js */ "./shared/ImmHelpers.js"),
  setIn = _require.setIn;
var _require2 = __webpack_require__(/*! ../../core/vault/StateCursors.js */ "./src/core/vault/StateCursors.js"),
  atDemoData = _require2.atDemoData,
  atUser = _require2.atUser,
  atPage = _require2.atPage,
  atLibraryChapter = _require2.atLibraryChapter,
  atLibraryPages = _require2.atLibraryPages,
  atAllLibraryChapters = _require2.atAllLibraryChapters;
var ChapterSection = __webpack_require__(/*! ../../../shared/ChapterSection.js */ "./shared/ChapterSection.js");
var TrainerCore = __webpack_require__(/*! ../../../shared/TrainerCore.js */ "./shared/TrainerCore.js");
var LoadState = __webpack_require__(/*! ../../core/vault/util/LoadState.js */ "./src/core/vault/util/LoadState.js");
var OpsLibrary = __webpack_require__(/*! ./OpsLibrary.js */ "./src/library/vault/OpsLibrary.js");
var OpsLibraryPages = __webpack_require__(/*! ./OpsLibraryPages.js */ "./src/library/vault/OpsLibraryPages.js");
var OpsUser = __webpack_require__(/*! ../../core/vault/OpsUser.js */ "./src/core/vault/OpsUser.js");
var OpsPage = __webpack_require__(/*! ../../core/vault/OpsPage.js */ "./src/core/vault/OpsPage.js");
var Slots = __webpack_require__(/*! ../../core/vault/Slots.js */ "./src/core/vault/Slots.js");
var dbDemoData = __webpack_require__(/*! ../../../shared/data/dbDemoData.json */ "./shared/data/dbDemoData.json");
var clearProfileForSelf = function clearProfileForSelf(state, clock) {
  var userID = atUser(state).getIn("userID");
  return Slots.loadRestartMany(state, [Slots.table.profile(userID), Slots.table.profileActivity(userID, clock.now()), Slots.table.profileActivityDay(userID, clock.now())]);
};
var actionHandlers = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, AT.LIBRARY_INITIAL, function (vault, state, action) {
  OpsLibrary.setupThrottlerInVault(vault);
  return state;
}), AT.LOAD_DEMO_LIBRARY_CHAPTERS, function (vault, state, action) {
  // for demo chapters, check to see if they exist already in vault
  // if not, load them
  _.forEach(dbDemoData.chapterIDs, function (chapterID) {
    var chapterCR = atLibraryChapter(state, chapterID);
    if (!chapterCR.getIn("model")) {
      state = chapterCR.canCreate().set(function (c) {
        return atDemoData(state).get().libraryChapterData[chapterID];
      });
    }
  });
  state = atAllLibraryChapters(state).set(function (lc) {
    return LoadState.loadSuccess(lc);
  });
  return state;
}), AT.SET_VIEWED_LIBRARY_PAGE, function (vault, state, action) {
  var chapterID = action.chapterID,
    pageNumber = action.pageNumber;
  var demo = state.page.demo;
  state = atLibraryPages(state).canCreate().set(function (lp) {
    lp = OpsLibraryPages.initForChapter(lp, chapterID, demo);
    lp = OpsLibraryPages.setPageNumber(lp, pageNumber);
    lp = OpsLibraryPages.loadAutoPageStart(lp, vault.api, demo);
    return lp;
  });
  if (atLibraryChapter(state, chapterID).getIn("model")) {
    state = atLibraryChapter(state, chapterID).canCreate().setIn(["model", "lastPageVisited"], pageNumber);
    if (!demo && !OpsPage.isParentPage(state.page)) {
      var userID = atUser(state).getIn("userID");
      var libraryChapter = atLibraryChapter(state, chapterID).get();
      var page = atPage(state).get();
      vault.throttler.queue("libraryChapter", {
        libraryChapter: libraryChapter,
        userID: userID,
        page: page
      });
    }
  }
  /*
  	This sequencePage is added to track viewed library page
  	without depending on page.pageNumber and having to deal with
  	issue related to updating pageNumber for sequence slideout.
  */
  state = atPage(state).set(function (pg) {
    pg = setIn(pg, "sequencePage", pageNumber);
    return pg;
  });
  return state;
}), AT.LOAD_LIBRARY_PAGES_SUCCESS, function (vault, state, action) {
  var chapterID = action.chapterID;
  var demo = state.page.demo;
  state = atLibraryPages(state).canCreate().set(function (lp) {
    if (lp && lp.chapterID !== chapterID) {
      return lp;
    }
    lp = OpsLibraryPages.initForChapter(lp, chapterID, demo);
    lp = OpsLibraryPages.loadPageSuccess(lp, action.data);
    // Chain together more loading calls until we're out of things to load.
    lp = OpsLibraryPages.loadAutoPageStart(lp, vault.api, demo);
    return lp;
  });
  return state;
}), AT.LOAD_LIBRARY_PAGES_FAIL, function (vault, state, action) {
  var chapterID = action.chapterID;
  var demo = state.page.demo;
  state = atLibraryPages(state).canCreate().set(function (lp) {
    if (lp && lp.chapterID !== chapterID) {
      return lp;
    }
    lp = OpsLibraryPages.initForChapter(lp, chapterID, demo);
    lp = OpsLibraryPages.loadPageFail(lp, action.payload.pageNumbers, action.error);
    // Chain together more loading calls until we're out of things to load.
    lp = OpsLibraryPages.loadAutoPageStart(lp, vault.api, demo);
    return lp;
  });
  return state;
}), AT.UPDATE_PAGES_READ, function (vault, state, action) {
  var chapterID = action.chapterID,
    pageJustRead = action.pageJustRead;
  state = atLibraryChapter(state, chapterID).canCreate().set(function (lc) {
    var page = atPage(state).get();
    lc = setIn(lc, "model", function (model) {
      if (model) {
        return OpsLibrary.updateReadPages(vault.clock, model, pageJustRead, page.demo);
      }
    });
    if (!page.demo && lc.model && !OpsPage.isParentPage(page)) {
      var userID = atUser(state).getIn("userID");
      vault.throttler.queue("libraryChapter", {
        libraryChapter: lc,
        userID: userID,
        page: page
      });
    }
    return lc;
  });
  return state;
}), AT.UPDATE_SECTIONS_MARKED_DONE, function (vault, state, action) {
  var chapterID = action.chapterID,
    sectionID = action.sectionID;
  state = atLibraryChapter(state, chapterID).canCreate().set(function (lc) {
    var userID = atUser(state).getIn("userID");
    var page = atPage(state).get();
    lc = setIn(lc, "model", function (model) {
      if (model) {
        return OpsLibrary.updateSectionsMarkedDone(vault.clock, model, sectionID, page.demo);
      }
    });
    OpsLibrary.updateChapterData(lc, userID, page, vault.api, vault.throttler);
    if (!page.demo && lc.model && !OpsPage.isParentPage(page)) {
      vault.throttler.queue("libraryChapter", {
        libraryChapter: lc,
        userID: userID,
        page: page
      });
    }
    return lc;
  });
  return state;
}), AT.UPDATE_LIBRARY_CHAPTER_DATA_SUCCESS, function (vault, state, action) {}), AT.UPDATE_LIBRARY_CHAPTER_DATA_FAIL, function (vault, state, action) {
  var chapterID = action.chapterID;
  var chapterModel = atLibraryChapter(state, chapterID).get();
  if (action.error === "E_DISCONNECTED") {
    // TODO: share with result retry
    OpsLibrary.doDelayedRetry(chapterModel, vault.dispatchAfter);
  }
}), AT.RETRY_UPDATE_LIBRARY_CHAPTER, function (vault, state, action) {
  var chapterModel = action.chapterModel;
  if (chapterModel && OpsLibrary.canRetryUpdate(chapterModel, vault.clock, action.currentFails)) {
    var userID = atUser(state).getIn("userID");
    var page = atPage(state).get();
    state = atLibraryChapter(state, chapterModel.chapterID).canCreate().set(function (lc) {
      return OpsLibrary.updateChapterData(lc, userID, page, vault.api, vault.throttler);
    });
  }
  return state;
});

// When setting page to a library chapter page,
// make sure to always go to the page that user left off
var validateLibraryPage = function validateLibraryPage(vault, oldState, newState, action) {
  var newPage = atPage(newState).get();
  if (newPage.name === "library.grade") {
    newState = checkForUserLoadOnBadGrade(vault, oldState, newState, action);
  }
  if (newPage.name === "library.chapter") {
    newState = atPage(newState).set(function (p) {
      return OpsLibrary.fillLibraryPage(p, newState);
    });
  }
  return newState;
};
var checkForUserLoadOnBadGrade = function checkForUserLoadOnBadGrade(vault, oldState, newState, action) {
  // TODO: Mirrors function in UpdateTrainer
  if (action.type !== AT.LOAD_USER_SUCCESS && action.type !== AT.LIBRARY_INITIAL) {
    return newState;
  }
  var page = atPage(newState).get();
  if (OpsPage.isInLibrary(page) && !OpsLibrary.isValidLibraryGrade(page, newState)) {
    newState = atPage(newState).set(function (p) {
      return OpsLibrary.fillLibraryPage(p, newState);
    });
    vault.emitEvent("showGradeModal");
  }
  return newState;
};
var updateLibraryChapterData = function updateLibraryChapterData(vault, oldState, newState, action) {
  var clock = vault.clock,
    api = vault.api,
    throttler = vault.throttler;
  var oldPage = atPage(oldState).get();
  var newPage = atPage(newState).get();
  var isOldOnChapter = oldPage.name === "library.chapter";
  var isNewOnChapter = newPage.name === "library.chapter";
  var oldChapterID = ChapterSection.toChapterID(oldPage.gradeNumber, oldPage.chapterIndex);
  var newChapterID = ChapterSection.toChapterID(newPage.gradeNumber, newPage.chapterIndex);
  var oldSectionID = OpsLibrary.getSectionIDFromLastVisited(oldChapterID, oldState);
  var newSectionID = OpsLibrary.getSectionIDFromLastVisited(newChapterID, newState);
  var onSameChapter = isOldOnChapter && isNewOnChapter && oldChapterID === newChapterID;
  var onSameSection = onSameChapter && oldSectionID === newSectionID;
  if (onSameChapter) {
    var oldChapterRead = atLibraryChapter(oldState, oldChapterID).getIn(["model", "isCompletelyRead"]);
    var newChapterRead = atLibraryChapter(newState, newChapterID).getIn(["model", "isCompletelyRead"]);
    if (!oldChapterRead && newChapterRead) {
      newState = atUser(newState).set(function (u) {
        return OpsUser.addXP(u, TrainerCore.getReadChapterXP());
      });
    }
  }
  if (isOldOnChapter && !onSameChapter && !newPage.demo) {
    // When going to or from a library chapter page,
    // Stop timing on old section and start timing on new section
    var userID = atUser(newState).getIn("userID");
    var libraryChapter = atLibraryChapter(newState, oldChapterID).get();
    OpsLibrary.updateChapterData(libraryChapter, userID, newPage, api, throttler);
  }
  if (isNewOnChapter && !onSameSection) {
    newState = clearProfileForSelf(newState, clock);
    if (!newPage.demo) {
      var _userID = atUser(newState).getIn("userID");
      var _libraryChapter = atLibraryChapter(newState, newChapterID).get();
      throttler.queue("libraryChapter", {
        libraryChapter: _libraryChapter,
        userID: _userID,
        page: newPage
      });
    }
  }
  return newState;
};
var augment = function augment(updater) {
  updater.addActionHandler(actionHandlers);
  updater.addPostUpdateHook(validateLibraryPage, "library:validateLibraryPage", -1000);
  updater.addPostUpdateHook(updateLibraryChapterData, "library:updateLibraryChapterData");
};
module.exports = {
  augment: augment
};

/***/ }

}]);
//# sourceMappingURL=bundle_library.js.map