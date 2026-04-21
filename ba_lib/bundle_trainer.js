(globalThis["webpackChunkba"] = globalThis["webpackChunkba"] || []).push([["trainer"],{

/***/ "./src/core/view/ChapterPathButton.jsx"
/*!*********************************************!*\
  !*** ./src/core/view/ChapterPathButton.jsx ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var AssetsUtil = __webpack_require__(/*! ../util/AssetsUtil.js */ "./src/core/util/AssetsUtil.js");
var colors = (__webpack_require__(/*! ../util/ColorUtil.js */ "./src/core/util/ColorUtil.js").getCurrentScheme)();
var QuadTable = (__webpack_require__(/*! ../util/QuadUtil.js */ "./src/core/util/QuadUtil.js").quadTable);
var Sounds = __webpack_require__(/*! ../util/Sounds.js */ "./src/core/util/Sounds.js");
var Z = __webpack_require__(/*! ../../../shared/ZIndex.js */ "./shared/ZIndex.js");
var BlueButton = __webpack_require__(/*! ./BlueButton.jsx */ "./src/core/view/BlueButton.jsx");
var MessageModal = __webpack_require__(/*! ./MessageModal.jsx */ "./src/core/view/MessageModal.jsx");
var ModalClose = __webpack_require__(/*! ./ModalClose.jsx */ "./src/core/view/ModalClose.jsx");
var PieGraph = __webpack_require__(/*! ./PieGraph.jsx */ "./src/core/view/PieGraph.jsx");
var Quad = __webpack_require__(/*! ./Quad.jsx */ "./src/core/view/Quad.jsx");
var StudentLink = __webpack_require__(/*! ./StudentLink.jsx */ "./src/core/view/StudentLink.jsx");
var Tooltip = __webpack_require__(/*! ./Tooltip.jsx */ "./src/core/view/Tooltip.jsx");
var Undraggable = __webpack_require__(/*! ../../core/view/Undraggable.jsx */ "./src/core/view/Undraggable.jsx");
var _require = __webpack_require__(/*! ../util/HOCUtil.js */ "./src/core/util/HOCUtil.js"),
  getBaseInstance = _require.getBaseInstance;
var styles = __webpack_require__(/*! ./styles/ChapterPathButton.css */ "./src/core/view/styles/ChapterPathButton.css");
module.exports = createReactClass({
  displayName: "ChapterPathButton",
  propTypes: {
    buttonType: PT.oneOf(["coreLesson", "enrichmentLesson", "reading", "test", "stairsUp", "stairsDown", "locked"]).isRequired,
    isLocked: PT.bool.isRequired,
    blockID: PT.number,
    canClick: PT.func,
    cardinal: PT.string,
    className: PT.string,
    forceHover: PT.bool,
    handleClick: PT.func,
    homeworkData: PT.oneOfType([PT.object, PT.array]),
    // object for single room, array for multiple rooms (staircase)
    isComplete: PT.bool,
    isTrophyAvailable: PT.bool,
    isTrophyComplete: PT.bool,
    isUpstairs: PT.bool,
    lessonPromptID: PT.number,
    linkTo: PT.string,
    lockedText: PT.string,
    // Provide this value to show modal when locked
    lockedTooltipText: PT.string,
    // Provide this value to show tooltip when locked
    onMouseEnter: PT.func,
    onMouseLeave: PT.func,
    percentComplete: PT.number,
    showLessonPrompt: PT.func,
    stairProgress: PT.array,
    stars: PT.number,
    tooltipSize: PT.string,
    tooltipText: PT.string,
    trophyURL: PT.string
  },
  getInitialState: function getInitialState() {
    return {
      isLockedModalOpen: false
    };
  },
  getIconName: function getIconName() {
    var buttonType = this.props.buttonType;
    var typeToNameMap = {
      coreLesson: "bell",
      enrichmentLesson: "monster",
      reading: "book",
      test: "test",
      stairsUp: "stairs-up",
      stairsDown: "stairs-down",
      locked: "lock-path"
    };
    return typeToNameMap[buttonType];
  },
  isStaircase: function isStaircase() {
    var buttonType = this.props.buttonType;
    return ["stairsUp", "stairsDown"].includes(buttonType);
  },
  isReading: function isReading() {
    var buttonType = this.props.buttonType;
    return buttonType === "reading";
  },
  click: function click(evt) {
    var _this$linkRef;
    if (_.isFunction(this === null || this === void 0 || (_this$linkRef = this.linkRef) === null || _this$linkRef === void 0 ? void 0 : _this$linkRef.click)) {
      this.linkRef.click();
    }
  },
  defaultClickHandler: function defaultClickHandler(evt) {
    var _this$props = this.props,
      buttonType = _this$props.buttonType,
      isLocked = _this$props.isLocked,
      handleClick = _this$props.handleClick,
      canClick = _this$props.canClick,
      lockedText = _this$props.lockedText;
    if (canClick && !canClick()) {
      return;
    }
    var soundMap = {
      coreLesson: "lesson-click",
      enrichmentLesson: "lesson-click",
      reading: "book-section-click",
      test: "lesson-click",
      locked: "locked-lesson"
      // NOTE: no staircase sounds
    };
    // locked reading buttons should have the locked sound
    var clickSound = soundMap[isLocked ? "locked" : buttonType];
    if (clickSound) {
      Sounds.playSound(clickSound);
    }
    if (isLocked && lockedText) {
      this.setState({
        isLockedModalOpen: true
      });
    } else if (handleClick) {
      handleClick();
    }
  },
  renderRing: function renderRing() {
    var _this$props2 = this.props,
      _this$props2$percentC = _this$props2.percentComplete,
      percentComplete = _this$props2$percentC === void 0 ? 0 : _this$props2$percentC,
      isLocked = _this$props2.isLocked,
      stars = _this$props2.stars,
      isComplete = _this$props2.isComplete;
    var bgColor = isComplete || stars ? colors.starYellow : colors.white;
    if (stars || percentComplete === 1 || isLocked) {
      return /*#__PURE__*/React.createElement("div", {
        className: styles.ring
      });
    }
    return /*#__PURE__*/React.createElement(PieGraph, {
      className: styles.ring,
      data: [{
        percent: percentComplete,
        color: colors.starYellow
      }],
      backgroundColor: bgColor
    });
  },
  renderTrophy: function renderTrophy() {
    var _this$props3 = this.props,
      isTrophyAvailable = _this$props3.isTrophyAvailable,
      isTrophyComplete = _this$props3.isTrophyComplete;
    if (isTrophyAvailable) {
      var className = isTrophyComplete ? styles.wartComplete : styles.wart;
      return /*#__PURE__*/React.createElement("div", {
        className: className
      }, /*#__PURE__*/React.createElement("img", {
        className: styles.trophyIcon,
        src: AssetsUtil.getButton(isTrophyComplete ? "trophy-earned" : "trophy-unearned")
      }));
    }
    return null;
  },
  renderHomework: function renderHomework() {
    var homeworkData = this.props.homeworkData;
    homeworkData = _.isArray(homeworkData) ? homeworkData : [homeworkData];
    homeworkData = homeworkData.filter(Boolean);
    if (homeworkData.length === 0) return null;
    var _homeworkData$reduce = homeworkData.reduce(function (prev, curr) {
        return {
          hasAcademy: prev.hasAcademy || curr.isAcademy,
          allComplete: prev.allComplete && curr.isComplete,
          hasCurrentWeek: prev.hasCurrentWeek || curr.isCurrentWeek
        };
      }, {
        hasAcademy: false,
        allComplete: true,
        hasCurrentWeek: false
      }),
      hasAcademy = _homeworkData$reduce.hasAcademy,
      allComplete = _homeworkData$reduce.allComplete,
      hasCurrentWeek = _homeworkData$reduce.hasCurrentWeek;
    var iconSrc = AssetsUtil.getHWIcon(hasAcademy, allComplete);
    var iconClass = hasAcademy && !hasCurrentWeek ? styles.hwOld : styles.hw;
    return /*#__PURE__*/React.createElement("div", {
      className: styles.wartLeft
    }, /*#__PURE__*/React.createElement("img", {
      src: iconSrc,
      className: iconClass
    }));
  },
  renderLocked: function renderLocked() {
    var iconSrc = AssetsUtil.getButton(this.isStaircase() ? this.getIconName() : "lock-path", "white");
    return /*#__PURE__*/React.createElement("div", {
      className: styles.lockedButton
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.ringLocked
    }), /*#__PURE__*/React.createElement("div", {
      className: styles.buttonInner
    }, /*#__PURE__*/React.createElement("img", {
      src: iconSrc,
      className: styles.icon
    })));
  },
  renderStaircase: function renderStaircase() {
    var _this$props4 = this.props,
      isUpstairs = _this$props4.isUpstairs,
      isComplete = _this$props4.isComplete;
    var iconName = this.getIconName();
    var color = isComplete ? "complete" : "white";
    var iconSrc = AssetsUtil.getButton(iconName, color);
    var iconStatus = isComplete ? "complete" : "inprogress";
    var outerClasses = [styles.staircase, isUpstairs ? styles.upstairs : styles.downstairs, styles[iconStatus]];
    return /*#__PURE__*/React.createElement("div", {
      className: outerClasses.join(" ")
    }, isUpstairs ? null : this.renderRing(), /*#__PURE__*/React.createElement("div", {
      className: styles.buttonInner
    }, /*#__PURE__*/React.createElement("img", {
      src: iconSrc,
      className: isComplete ? styles.icon : styles.incompleteIcon
    })), this.renderHomework());
  },
  renderReading: function renderReading() {
    var _this$props5 = this.props,
      forceHover = _this$props5.forceHover,
      isComplete = _this$props5.isComplete;
    var iconName = this.getIconName();
    var color = isComplete ? "gold" : "blue";
    var iconStatus = isComplete ? "complete" : "inprogress";
    var classes = [styles.reading, styles[iconStatus], forceHover ? styles.hoverEffect : ""].filter(Boolean);
    var iconSrc = AssetsUtil.getButton(iconName, color);

    // Adding extra outer layer instead of border because of weird filter effects
    return /*#__PURE__*/React.createElement("img", {
      src: iconSrc,
      className: classes.join(" ")
    });
  },
  renderLesson: function renderLesson() {
    var _this$props6 = this.props,
      forceHover = _this$props6.forceHover,
      isComplete = _this$props6.isComplete,
      stars = _this$props6.stars;
    var iconName = this.getIconName();
    var completed = !!(isComplete || stars);
    var color = completed ? "complete" : "white";
    var iconStatus = completed ? "complete" : "inprogress";
    var iconClass = completed ? styles.icon : styles.incompleteIcon;
    var outerClasses = [styles.lesson, styles[iconStatus], forceHover ? styles.hoverEffect : ""].filter(Boolean);
    var iconSrc = stars ? AssetsUtil.getStarImage(stars, true) : AssetsUtil.getButton(iconName, color);

    // Adding extra outer layer instead of border because of weird filter effects
    return /*#__PURE__*/React.createElement("div", {
      className: outerClasses.join(" ")
    }, this.renderTrophy(), this.renderRing(), /*#__PURE__*/React.createElement("div", {
      className: styles.buttonInner
    }, /*#__PURE__*/React.createElement("img", {
      src: iconSrc,
      className: iconClass
    })), this.renderHomework());
  },
  renderPrompt: function renderPrompt() {
    var _this$props7 = this.props,
      isTrophyComplete = _this$props7.isTrophyComplete,
      linkTo = _this$props7.linkTo,
      showLessonPrompt = _this$props7.showLessonPrompt,
      stars = _this$props7.stars,
      trophyURL = _this$props7.trophyURL;
    if (!this.shouldShowLessonPrompt()) return;
    return /*#__PURE__*/React.createElement("div", {
      className: styles.prompt
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.promptQuad
    }, /*#__PURE__*/React.createElement(Quad, {
      quad: QuadTable.lessonPrompt,
      borderWidths: [5, 2, 5, 2],
      borderUnits: "%",
      backgroundClass: styles.promptBg,
      borderClass: styles.promptBorder,
      shadowOffset: 3,
      shadowOpacity: 0.4,
      shadowBlur: true
    })), /*#__PURE__*/React.createElement("div", {
      className: styles.promptText
    }, "What would you like to do?"), /*#__PURE__*/React.createElement("div", {
      className: styles.promptButtons
    }, /*#__PURE__*/React.createElement(BlueButton, {
      linkTo: linkTo,
      buttonType: "trapFlippedWide",
      buttonText: stars ? "Replay Lesson" : "Play Lesson",
      buttonImageSrc: AssetsUtil.getButton("bell", "white"),
      buttonImageSize: 2,
      overrideTextClass: styles.buttonText,
      scale: 0.7
    }), /*#__PURE__*/React.createElement(BlueButton, {
      linkTo: trophyURL,
      buttonType: "trapNormalWide",
      buttonText: isTrophyComplete ? "View Trophy" : "Play Trophy",
      buttonImageSrc: AssetsUtil.getButton("trophy-unearned"),
      buttonImageSize: 2,
      overrideTextClass: styles.buttonText,
      scale: 0.7
    })), /*#__PURE__*/React.createElement(ModalClose, {
      extraClassName: styles.close,
      onClick: function onClick() {
        return showLessonPrompt(0);
      }
    }));
  },
  showLessonPromptHandler: function showLessonPromptHandler(evt) {
    evt.stopPropagation();
    var _this$props8 = this.props,
      blockID = _this$props8.blockID,
      showLessonPrompt = _this$props8.showLessonPrompt;
    showLessonPrompt && showLessonPrompt(blockID);
  },
  shouldShowLessonPrompt: function shouldShowLessonPrompt() {
    var _this$props9 = this.props,
      isLocked = _this$props9.isLocked,
      lessonPromptID = _this$props9.lessonPromptID,
      blockID = _this$props9.blockID;
    return !isLocked && lessonPromptID && lessonPromptID === blockID;
  },
  renderModal: function renderModal() {
    var _this = this;
    var lockedText = this.props.lockedText;
    var isLockedModalOpen = this.state.isLockedModalOpen;
    var handleModalClose = function handleModalClose() {
      return _this.setState({
        isLockedModalOpen: false
      });
    };
    if (isLockedModalOpen) {
      return /*#__PURE__*/React.createElement(MessageModal, {
        styleType: "chapterPage",
        onClose: handleModalClose,
        buttonText: "ok"
      }, lockedText);
    }
    return null;
  },
  render: function render() {
    var _this2 = this;
    var _this$props0 = this.props,
      buttonType = _this$props0.buttonType,
      linkTo = _this$props0.linkTo,
      canClick = _this$props0.canClick,
      onMouseEnter = _this$props0.onMouseEnter,
      onMouseLeave = _this$props0.onMouseLeave,
      isLocked = _this$props0.isLocked,
      cardinal = _this$props0.cardinal,
      tooltipText = _this$props0.tooltipText,
      lockedTooltipText = _this$props0.lockedTooltipText,
      isTrophyAvailable = _this$props0.isTrophyAvailable;
    var isPrompt = this.shouldShowLessonPrompt();
    var isStaircase = this.isStaircase();
    var isReading = this.isReading();
    var iconEl;
    if (buttonType === "locked" || isLocked) {
      iconEl = this.renderLocked();
    } else if (isStaircase) {
      iconEl = this.renderStaircase();
    } else if (isReading) {
      iconEl = this.renderReading();
    } else {
      // lesson and tests
      iconEl = this.renderLesson();
    }
    var className = styles[cardinal] || styles.centerOffset;
    if (isStaircase) {
      className = styles[cardinal + "Stairs"];
    }
    if (isPrompt) {
      className += " " + styles.withPrompt;
    }
    var text = tooltipText;
    if (isLocked && lockedTooltipText) text = lockedTooltipText;
    var tooltipSize = isStaircase || isLocked ? "medium" : "small";
    if (this.props.tooltipSize) tooltipSize = this.props.tooltipSize;
    var clickHandler = isTrophyAvailable ? this.showLessonPromptHandler : this.defaultClickHandler;
    var theLink = isTrophyAvailable || isLocked ? "" : linkTo;
    if (this.props.className) className = this.props.className;
    return /*#__PURE__*/React.createElement(Undraggable, null, /*#__PURE__*/React.createElement(Tooltip, {
      tooltipText: text,
      size: tooltipSize,
      tooltipStyle: {
        zIndex: Z.tooltipIcon
      },
      stretchWidth: true,
      className: className
    }, this.renderPrompt(), /*#__PURE__*/React.createElement(StudentLink, {
      ref: function ref(link) {
        return _this2.linkRef = getBaseInstance(link);
      },
      to: theLink,
      canClick: canClick,
      useWonkyCursor: true,
      stopTouchPropagation: true,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
      clickAction: clickHandler
    }, iconEl)), this.renderModal());
  }
});

/***/ },

/***/ "./src/core/view/ConfirmTestModal.jsx"
/*!********************************************!*\
  !*** ./src/core/view/ConfirmTestModal.jsx ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var withAnimateRef = __webpack_require__(/*! ../hoc/withAnimateRef.jsx */ "./src/core/hoc/withAnimateRef.jsx");
var withVaultDispatch = __webpack_require__(/*! ../hoc/withVaultDispatch.jsx */ "./src/core/hoc/withVaultDispatch.jsx");
var withContainerDims = __webpack_require__(/*! ../hoc/withContainerDims.jsx */ "./src/core/hoc/withContainerDims.jsx");
var withDelayedRender = __webpack_require__(/*! ../hoc/withDelayedRender.jsx */ "./src/core/hoc/withDelayedRender.jsx");
var BlueButton = __webpack_require__(/*! ./BlueButton.jsx */ "./src/core/view/BlueButton.jsx");
var AssetsUtil = __webpack_require__(/*! ../util/AssetsUtil.js */ "./src/core/util/AssetsUtil.js");
var Modal = __webpack_require__(/*! ./Modal.jsx */ "./src/core/view/Modal.jsx");
var _require = __webpack_require__(/*! ../../../shared/PortalConstants.ts */ "./shared/PortalConstants.ts"),
  PORTAL_CONTAINERS = _require.PORTAL_CONTAINERS;
var styles = __webpack_require__(/*! ./styles/ConfirmTestModal.css */ "./src/core/view/styles/ConfirmTestModal.css");
var augment = function augment(Component) {
  Component = withVaultDispatch(Component);
  Component = withAnimateRef(Component);
  Component = withContainerDims(Component);
  // This component contains animations in componentDidMount, so we need to
  // delay rendering via a higher-order component.
  Component = withDelayedRender(Component);
  return Component;
};
module.exports = augment(createReactClass({
  displayName: "ConfirmTestModal",
  propTypes: {
    onClose: PT.func,
    contents: PT.object,
    checkButtonText: PT.string,
    checkClickHandler: PT.func,
    submitButtonText: PT.string,
    submitClickHandler: PT.func,
    submitButtonToSide: PT.bool,
    gradeNumber: PT.number,
    // Injected by HOCs
    dispatch: PT.func.isRequired,
    animateRef: PT.func.isRequired,
    containerDims: PT.object.isRequired
  },
  render: function render() {
    var _this$props = this.props,
      onClose = _this$props.onClose,
      contents = _this$props.contents,
      gradeNumber = _this$props.gradeNumber,
      checkButtonText = _this$props.checkButtonText,
      checkClickHandler = _this$props.checkClickHandler,
      submitButtonText = _this$props.submitButtonText,
      submitClickHandler = _this$props.submitClickHandler,
      submitButtonToSide = _this$props.submitButtonToSide;
    var checkButton = null;
    if (checkClickHandler) {
      checkButton = /*#__PURE__*/React.createElement(BlueButton, {
        key: "button-check",
        className: styles.button,
        handleClick: checkClickHandler,
        buttonType: checkButtonText,
        variant: "gray"
      });
    }
    var submitButton = null;
    if (submitClickHandler) {
      submitButton = /*#__PURE__*/React.createElement(BlueButton, {
        key: "button-submit",
        className: submitButtonToSide ? styles.buttonToLeft : styles.button,
        handleClick: submitClickHandler,
        buttonType: submitButtonText
      });
    }
    return /*#__PURE__*/React.createElement(Modal, {
      portalContainer: PORTAL_CONTAINERS.TRAINER_MESSAGE,
      onClose: onClose,
      closeOnBackdropClick: true,
      closeOnEsc: true,
      hasCloseButton: true,
      backdropClass: styles.backdrop,
      modalClass: styles.main,
      levelType: "aboveAll"
    }, /*#__PURE__*/React.createElement("img", {
      className: styles.beast,
      src: AssetsUtil.getBeastInstruction("headmaster", gradeNumber)
    }), /*#__PURE__*/React.createElement("div", {
      className: styles.contentBeast
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.content
    }, contents)), /*#__PURE__*/React.createElement("div", {
      className: styles.buttons
    }, checkButton, submitButton));
  }
}));

/***/ },

/***/ "./src/core/view/MultiLoadGuard.jsx"
/*!******************************************!*\
  !*** ./src/core/view/MultiLoadGuard.jsx ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var LoadGuard = __webpack_require__(/*! ./LoadGuard.jsx */ "./src/core/view/LoadGuard.jsx");
module.exports = createReactClass({
  displayName: "MultiLoadGuard",
  propTypes: {
    // See LoadGuard for the meaning of most of these. In addition,
    // all LoadGuard props not in the guardList objects can also be passed.
    // e.g. loadingView, errorView.

    guardList: PT.arrayOf(PT.shape({
      identifier: PT.string,
      status: PT.shape({
        load: PT.oneOf(["none", "pending", "done", "error"]).isRequired,
        loadError: PT.any
      }).isRequired,
      requestLoad: PT.func,
      noGuard: PT.bool,
      needsBundle: PT.string
    })).isRequired,
    // Function to call that returns view when loaded. (Unlike LoadGuard, this
    // view does not support the children prop.)
    renderLoaded: PT.func.isRequired
  },
  // Returns this.props with MultiLoadGuard specific things omitted. These
  // props are forwarded to the child LoadGuards.
  getPropsToForward: function getPropsToForward() {
    return _.omit(this.props, ["guardList", "renderLoaded", "children", "identifier", "status", "requestLoad", "noGuard", "needsBundle"]);
  },
  // Takes one element of the guardList array and returns whether it should
  // be considered finished.
  isDone: function isDone(glObj) {
    return glObj.status.load === "done" || glObj.noGuard;
  },
  // Takes one undone element of the guardList array and returns a LoadGuard
  // element. index is the index of the LoadGuard among those unfinished.
  // baseProps should be the return of this.getPropsToForward. Only the first
  // LoadGuard will render visibly.
  renderOneGuard: function renderOneGuard(glObj, index, fwProps) {
    var baseProps = index === 0 ? fwProps : {
      loadingView: null,
      errorView: null
    };
    return /*#__PURE__*/React.createElement(LoadGuard, _extends({
      key: fwProps.identifier || index
    }, baseProps, glObj, {
      renderLoaded: function renderLoaded() {
        return null;
      }
    }));
  },
  render: function render() {
    var _this = this;
    var undone = this.props.guardList.filter(function (glObj) {
      return !_this.isDone(glObj);
    });
    if (!undone.length) {
      return this.props.renderLoaded() || null;
    }
    var fwProps = this.getPropsToForward();
    return /*#__PURE__*/React.createElement(React.Fragment, null, undone.map(function (glObj, i) {
      return _this.renderOneGuard(glObj, i, fwProps);
    }));
  }
});

/***/ },

/***/ "./src/core/view/NotFound.jsx"
/*!************************************!*\
  !*** ./src/core/view/NotFound.jsx ***!
  \************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var ErrorMessage = __webpack_require__(/*! ./ErrorMessage.jsx */ "./src/core/view/ErrorMessage.jsx");
module.exports = createReactClass({
  displayName: "NotFound",
  propTypes: {
    disconnected: PT.bool
  },
  render: function render() {
    var message = !this.props.disconnected ? "404" : "connection";
    return /*#__PURE__*/React.createElement(ErrorMessage, {
      standardMessage: message
    });
  }
});

/***/ },

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

/***/ "./src/core/view/Undraggable.jsx"
/*!***************************************!*\
  !*** ./src/core/view/Undraggable.jsx ***!
  \***************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var styles = __webpack_require__(/*! ./styles/Undraggable.css */ "./src/core/view/styles/Undraggable.css");

/**
 * Firefox (and potentially some other browsers) do all sorts of finicky
 * stuff to some elements to make them draggable. This behavior overrides
 * some "page" dragging (scrolling) behavior, which can become very
 * annoying. This class undoes all the various dragging behavior that
 * we don't want for specific elements.
 */

module.exports = createReactClass({
  displayName: "Undraggable",
  render: function render() {
    var children = this.props.children;
    return /*#__PURE__*/React.createElement("div", {
      className: styles.undraggable,
      draggable: "false",
      onDragStart: function onDragStart(e) {
        e.preventDefault();
      } // for Firefox
    }, children);
  }
});

/***/ },

/***/ "./src/trainer/EngineTestEnvironment.js"
/*!**********************************************!*\
  !*** ./src/trainer/EngineTestEnvironment.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var Banvas = __webpack_require__(/*! ./Banvas.js */ "./src/trainer/Banvas.js");
var EngineUtil = __webpack_require__(/*! ./EngineCreator.js */ "./src/trainer/EngineCreator.js");
var ContainerSize = __webpack_require__(/*! ../core/util/ContainerSize.js */ "./src/core/util/ContainerSize.js");
var CanvasUtil = __webpack_require__(/*! ../core/util/CanvasUtil.js */ "./src/core/util/CanvasUtil.js");
var LayoutUtil = __webpack_require__(/*! ./util/LayoutUtil.js */ "./src/trainer/util/LayoutUtil.js");
var ResultBanvas = __webpack_require__(/*! ./util/LegacyResultBanvas.js */ "./src/trainer/util/LegacyResultBanvas.js");
var TempCanvas = __webpack_require__(/*! ../core/util/TempCanvas.js */ "./src/core/util/TempCanvas.js");
var BatexPreviewWrapper = __webpack_require__(/*! ./banvasView/BatexPreviewWrapper.js */ "./src/trainer/banvasView/BatexPreviewWrapper.js");
var TrialsView = __webpack_require__(/*! ./banvasView/Trials.js */ "./src/trainer/banvasView/Trials.js");
var CanvasImage = __webpack_require__(/*! ../core/util/CanvasImage.js */ "./src/core/util/CanvasImage.js");
var CenterContainer = __webpack_require__(/*! ./banvasView/CenterContainer.js */ "./src/trainer/banvasView/CenterContainer.js");
var getContainerSize = function getContainerSize(sizeString) {
  var sizeWidths = {
    tiny: 150,
    small: 800,
    medium: 1000,
    large: 1200
  };
  var width = sizeWidths[sizeString] || 800;
  return ContainerSize.getContainerSizeFromWidth(width);
};

// This code runs only in baeditor and dev/previews and is not user-facing.
// So it's allowed to have console statements.

/* eslint-disable no-console */

module.exports = {
  getContainerSize: getContainerSize,
  getCanvasSize: function getCanvasSize(sizeString, optType) {
    var containerSize = getContainerSize(sizeString);
    if (optType === "instructions") {
      return {
        width: containerSize.width * 0.9 * 0.65 - ContainerSize.getScrollbarSize(containerSize),
        height: containerSize.height * 0.7 * 0.8
      };
    }
    return LayoutUtil.getProblemSize({}, {}, containerSize);
  },
  getFontSize: function getFontSize(sizeString, type) {
    var containerSize = getContainerSize(sizeString);
    var fontSizes = ContainerSize.getFontSizes(containerSize);
    if (type === "problem") {
      return fontSizes.canvas;
    } else if (type === "solution") {
      return fontSizes.solution;
    } else {
      return fontSizes.solution;
    }
  },
  //props must contain:
  // -canvas
  // -batex: text string with the batex to display
  //can optionally contain:
  // -previewSize: (tiny, small, medium, or large) which defaults to
  // -minHeight: if the text is too short, defaults to at least this height
  // -fontSizeType: which defaults to canvas
  // -fontFamily: which defaults to Roboto
  // -exampleProblemModels: an array of problemModels so that examples using those problems can be created
  // -messageLabel: a string to prepend to all errors
  previewBatex: function previewBatex(props) {
    CanvasUtil.setDPREnabled(false);
    var exampleProblemModels = props.exampleProblemModels || [];
    var exampleProblems = {};
    for (var i = 0; i < exampleProblemModels.length; i++) {
      var problem = _.extend({}, exampleProblemModels[i]);
      EngineUtil.initializeModel(problem);
      problem.baeditorID = problem.problemID;
      exampleProblems[problem.problemID] = problem;
    }
    var containerSize = getContainerSize(props.previewSize);
    var previewCanvas = props.canvas;
    var previewCtx = CanvasUtil.getShortvas(previewCanvas);
    var errors = [];
    try {
      var previewView = new BatexPreviewWrapper({
        batex: props.batex || "",
        exampleEngineCreator: EngineUtil.getBanvasProblemsEngineCreator(exampleProblems),
        forceFullWidth: true
      });
      var previewBanvas = new Banvas(previewCanvas);
      var fontFamily = props.fontFamily || "Roboto";
      previewBanvas.setContainerSize(containerSize);
      previewBanvas.setFontData({
        family: [fontFamily],
        sizeType: props.fontSizeType || "canvas"
      });
      previewBanvas.setTopView(previewView, {
        x: 0,
        y: 0,
        w: previewCanvas.width,
        h: previewCanvas.height
      });
      previewBanvas.setInteractive(false);
      var previewSize = previewBanvas.measure(previewCanvas.width);
      previewCanvas.height = Math.max(previewSize.h, props.minHeight || 0);
      previewBanvas.setRect({
        x: 0,
        y: 0,
        w: previewCanvas.width,
        h: previewCanvas.height
      });
      //Getting any errors from the Batex:
      var mLabel = props.messageLabel || "";
      errors = _.map(previewView.getBatexErrors() || [], function (e) {
        return mLabel + e.message + (e.pos ? " Character position: " + e.pos : "");
      });
      var previewDraw = function previewDraw() {
        previewCtx.save();
        previewCtx.fillStyle = "#FFFFFF";
        previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewCtx.restore();
        previewBanvas.resetContextFont();
        previewBanvas.allNeedsRender();
      };
      CanvasImage.withLoading(previewCtx, previewDraw, previewDraw);
      setTimeout(function () {
        previewBanvas.destroy({
          keepCanvasMemory: true
        });
      }, 100);
    } catch (error) {
      errors = _.concat(errors, "Javascript Error: " + error);
    }
    return errors;
  },
  getRendererID: function getRendererID(problemModel, options) {
    var _ref = options || {},
      _ref$alwaysUsePrimary = _ref.alwaysUsePrimary,
      alwaysUsePrimary = _ref$alwaysUsePrimary === void 0 ? false : _ref$alwaysUsePrimary;
    problemModel = _.extend({}, problemModel);
    if (alwaysUsePrimary) {
      return problemModel.rendererID;
    }
    return problemModel.interactiveRendererID || problemModel.rendererID;
  },
  checkTrial: function checkTrial(problemModel, trial, options) {
    var rendererID = this.getRendererID(problemModel, options);
    var problemProcessor = EngineUtil.getProblemProcessor(rendererID);
    EngineUtil.initializeModel(problemModel);
    var processedTrial = problemProcessor.check(trial, problemModel);
    return processedTrial;
  },
  // Used by CanvasReporter page for processor tests, not baeditor.
  // Returns the result of processor.check on the passed trial and problem.
  trial: function trial(trialCanvas, problemModel, _trial, w, h, options) {
    var PADDING = 10;
    CanvasUtil.setDPREnabled(false);
    trialCanvas.width = w + 2 * PADDING;
    trialCanvas.height = h + 2 * PADDING;
    problemModel = _.extend({}, problemModel);
    var containerSize = getContainerSize("small");
    var rendererID = this.getRendererID(problemModel, options);
    var problemProcessor = EngineUtil.getProblemProcessor(rendererID);
    EngineUtil.initializeModel(problemModel);
    var processedTrial = problemProcessor.check(_trial, problemModel);
    var forBanvasTrials = ResultBanvas.makeTrialsForBanvas([_trial], [processedTrial]);
    var trialBanvas = new Banvas(trialCanvas);
    trialBanvas.setContainerSize(containerSize);
    trialBanvas.setFontData({
      family: ["Roboto"],
      size: 20
    });
    trialBanvas.setTopView(new TrialsView({
      trials: forBanvasTrials,
      engineCreator: EngineUtil.getBanvasEngineCreator(problemModel, {
        isTrial: true
      }),
      isHorizontalList: true,
      trialLayoutType: "line"
    }), {
      x: PADDING,
      y: PADDING,
      w: w,
      h: h
    });
    setTimeout(function () {
      return trialBanvas.destroy({
        keepCanvasMemory: true
      });
    }, 100);
    return processedTrial;
  },
  problem: function problem(problemCanvas, problemModel, previewSize) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var printSize = options.printSize;
    var errors = [];
    CanvasUtil.setDPREnabled(false);
    problemModel = _.extend({}, problemModel);
    var rendererID = problemModel.interactiveRendererID || problemModel.rendererID;
    var engineSettings = EngineUtil.getEngineSettings(rendererID);
    try {
      EngineUtil.initializeModel(problemModel);
    } catch (error) {
      errors.push("Javascript error while initializing problem: " + error);
      console.log("ERRORED OUT INITIALIZING PROBLEM");
    }
    var containerSize = getContainerSize(previewSize);
    var fontSizes = ContainerSize.getFontSizes(containerSize);
    //Drawing the problem
    var verifyJSON = {};
    try {
      verifyJSON = EngineUtil.verifyProblemJSON(problemModel);
    } catch (error) {
      errors.push("Javascript error while verifying problem: " + error);
      console.log("ERRORED OUT VERIFYING PROBLEM");
    }
    var problemSize = printSize ? printSize : LayoutUtil.getProblemSize(problemModel, engineSettings, containerSize);
    problemCanvas.width = problemSize.width;
    problemCanvas.height = problemSize.height;
    var problemCtx = CanvasUtil.getShortvas(problemCanvas);
    problemCtx.font = fontSizes.canvas + "px Roboto";
    var problemBanvas;
    try {
      var props = {
        isPrintView: !!printSize
      };
      var problemEngine = new CenterContainer({
        child: EngineUtil.getBanvasEngine(problemModel, props)
      });
      problemBanvas = new Banvas(problemCanvas);
      problemBanvas.setContainerSize(containerSize);
      problemBanvas.setFontData({
        family: ["Roboto"],
        sizeType: "canvas"
      });
      problemBanvas.setTopView(problemEngine, {
        x: 0,
        y: 0,
        w: problemCanvas.width,
        h: problemCanvas.height
      });
      problemBanvas.setInteractive(false);
      var problemDraw = function problemDraw() {
        problemCtx.save();
        problemCtx.fillStyle = "#FFFFFF";
        problemCtx.fillRect(0, 0, problemCanvas.width, problemCanvas.height);
        problemCtx.restore();
        problemBanvas.allNeedsRender();
      };
      CanvasImage.withLoading(problemCtx, problemDraw, problemDraw);
      setTimeout(function () {
        problemBanvas.destroy({
          keepCanvasMemory: true
        });
      }, 100);
    } catch (error) {
      errors.push("Javascript error while previewing problem: " + error);
      console.log("ERRORED OUT PREVIEWING PROBLEM", errors);
    }
    return {
      errorMessages: _.concat(verifyJSON.errors, errors)
    };
  },
  solution: function solution(solutionCanvas, problemModel, previewSize) {
    var errors = [];
    CanvasUtil.setDPREnabled(false);
    problemModel = _.extend({}, problemModel);
    var rendererID = problemModel.interactiveRendererID || problemModel.rendererID;
    var problemProcessor = EngineUtil.getProblemProcessor(rendererID);
    var engineSettings = EngineUtil.getEngineSettings(rendererID);
    try {
      EngineUtil.initializeModel(problemModel);
    } catch (error) {
      errors.push("Javascript error while initializing problem: " + error);
      console.log("ERRORED OUT INITIALIZING PROBLEM");
    }
    var containerSize = getContainerSize(previewSize);
    var fontSizes = ContainerSize.getFontSizes(containerSize);
    var verifyJSON = {};
    try {
      verifyJSON = EngineUtil.verifyProblemJSON(problemModel);
    } catch (error) {
      errors.push("Javascript error while verifying problem: " + error);
      console.log("ERRORED OUT VERIFYING PROBLEM");
    }

    //Drawing the solution
    var solutionSize = {};

    // Sometimes rendering can crash if there is missing data in the problem model
    // so here we will wrap the entirety of the solution drawing in a try-catch
    // block so that we can still show any verification errors
    try {
      var trialCanvas = TempCanvas.requestCanvas();
      CanvasUtil.getShortvas(trialCanvas);
      var trialBanvas = new Banvas(trialCanvas);
      trialBanvas.setContainerSize(containerSize);
      trialBanvas.setFontData({
        family: ["Roboto"],
        sizeType: "solution"
      });
      trialBanvas.setTopView(new TrialsView({
        trials: [{}],
        engineCreator: EngineUtil.getBanvasEngineCreator(problemModel, {
          isTrial: true
        }),
        isHorizontalList: true,
        trialLayoutType: "line"
      }));
      var solutionLayout = LayoutUtil.calculateSolutionPageLayout({
        isTest: false,
        trialBanvas: trialBanvas,
        forceLayout: engineSettings.forceSolutionLayout
      });
      solutionSize = LayoutUtil.calculateSolutionPageSizing({
        isTest: false,
        trialBanvas: trialBanvas,
        layout: solutionLayout,
        containerSize: containerSize
      });
      trialBanvas.destroy();
      TempCanvas.releaseCanvas(trialCanvas);
      solutionCanvas.width = solutionSize.textWidth;
      solutionCanvas.height = solutionSize.textHeight;
      var solutionCtx = CanvasUtil.getShortvas(solutionCanvas);
      solutionCtx.font = fontSizes.solution + "px Roboto";
      var solutionEngine;
      if (problemModel.interactiveRendererID) {
        solutionEngine = EngineUtil.getInteractiveBanvasEngine(problemModel, true);
      } else {
        solutionEngine = EngineUtil.getBanvasEngine(problemModel, true);
      }
      var customCommands = solutionEngine && solutionEngine.getCustomCommands && solutionEngine.getCustomCommands(true);
      var solutionView = new BatexPreviewWrapper({
        batex: problemModel.solutionText || "",
        previewConfigCommands: problemProcessor.getConfigCommands && problemProcessor.getConfigCommands(problemModel),
        previewEngineCreator: EngineUtil.getBanvasEngineCreator(problemModel, {
          isPreview: true
        }),
        customCommands: customCommands,
        forceFullWidth: true
      });
      var solutionBanvas = new Banvas(solutionCanvas);
      solutionBanvas.setContainerSize(containerSize);
      solutionBanvas.setFontData({
        family: ["Roboto"],
        sizeType: "solution"
      });
      solutionBanvas.setTopView(solutionView, {
        x: 0,
        y: 0,
        w: solutionCanvas.width,
        h: solutionCanvas.height
      });
      solutionBanvas.setInteractive(false);
      var solutionTextSize = solutionBanvas.measure(solutionCanvas.width);
      solutionCanvas.height = Math.max(solutionCanvas.height, solutionTextSize.h);
      solutionBanvas.resetContextFont();
      solutionBanvas.setRect({
        x: 0,
        y: 0,
        w: solutionCanvas.width,
        h: solutionTextSize.h
      });
      var solutionDraw = function solutionDraw() {
        solutionCtx.save();
        solutionCtx.fillStyle = "#FFFFFF";
        solutionCtx.fillRect(0, 0, solutionCanvas.width, solutionCanvas.height);
        solutionCtx.restore();
        solutionBanvas.resetContextFont();
        solutionBanvas.allNeedsRender();
      };
      CanvasImage.withLoading(solutionCtx, solutionDraw, solutionDraw);
      setTimeout(function () {
        solutionBanvas.destroy({
          keepCanvasMemory: true
        });
      }, 100);
    } catch (error) {
      errors.push("Javascript error while previewing solution: " + error);
      console.log("ERRORED OUT PREVIEWING SOLUTION", errors);
    }
    return {
      solutionResize: solutionCanvas.height !== solutionSize.textHeight,
      solutionHeight: solutionSize.textHeight,
      errorMessages: _.concat(verifyJSON.errors, errors)
    };
  },
  preview: function preview(problemCanvas, solutionCanvas, problemModel, previewSize) {
    var problemInfo = this.problem(problemCanvas, problemModel, previewSize);
    var solutionInfo = this.solution(solutionCanvas, problemModel, previewSize);
    return {
      solutionResize: solutionInfo.solutionResize,
      solutionHeight: solutionInfo.solutionHeight,
      errorMessages: _.uniq([].concat(_toConsumableArray(problemInfo.errorMessages), _toConsumableArray(solutionInfo.errorMessages)))
    };
  },
  addBanvasRendererForPrint: function addBanvasRendererForPrint(problemCanvas, problemModel, printSize) {
    this.problem(problemCanvas, problemModel, null, {
      printSize: printSize
    });
  },
  printableEngine: function printableEngine(problemModel) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return EngineUtil.getPrintEngine(problemModel, options);
  },
  verifyTestRenderer: function verifyTestRenderer(rendererID) {
    //Makes sure the engine has a canReset function
    var errorMessages = [];
    var problemProcessor = EngineUtil.getProblemProcessor(rendererID);
    if (!problemProcessor.canReset) {
      errorMessages.push("No canReset function for this engine. All test questions must have a canReset function. Please make a developer aware of this issue.");
    }
    return {
      errorMessages: errorMessages
    };
  }
};

/***/ },

/***/ "./src/trainer/main.js"
/*!*****************************!*\
  !*** ./src/trainer/main.js ***!
  \*****************************/
(module, __unused_webpack_exports, __webpack_require__) {

var AT = __webpack_require__(/*! ../core/vault/ActionTypes.js */ "./src/core/vault/ActionTypes.js");
var UpdateTrainer = __webpack_require__(/*! ./vault/UpdateTrainer.js */ "./src/trainer/vault/UpdateTrainer.js");
var addURLHooks = __webpack_require__(/*! ./vault/addURLHooks.js */ "./src/trainer/vault/addURLHooks.js");
var initialize = function initialize(vault, updater, router) {
  UpdateTrainer.augment(updater);
  addURLHooks(router);
  vault.dispatchNow({
    type: AT.TRAINER_INITIAL
  });

  // Used by baeditor's play functionality.
  if (globalThis.PLAY_PROBLEM_DATA) {
    vault.dispatchNow({
      type: AT.SET_DEV_PROBLEM,
      problemData: globalThis.PLAY_PROBLEM_DATA
    });
  }
};
if (globalThis.IS_PLAYGROUND_PAGE) {
  var TrainerCore = __webpack_require__(/*! ../../shared/TrainerCore.js */ "./shared/TrainerCore.js");
  var devProblemData = __webpack_require__(/*! ./devProblemData.js */ "./src/trainer/devProblemData.js");
  var enginesData = __webpack_require__(/*! ../../shared/data/engines.json */ "./shared/data/engines.json");
  var EngineTestEnvironment = __webpack_require__(/*! ./EngineTestEnvironment.js */ "./src/trainer/EngineTestEnvironment.js");
  var SpriteAnimSet = __webpack_require__(/*! ./util/SpriteAnimSet.js */ "./src/trainer/util/SpriteAnimSet.js");
  // These are used in baeditor.
  globalThis.EngineTestEnvironment = EngineTestEnvironment;
  globalThis.getDefaultStarCutoffs = TrainerCore.getDefaultStarCutoffs;
  // This is used by the dev/previews and dev/printablepreview page.
  globalThis.devProblemData = devProblemData;
  // This is used by the dev/animation page.
  globalThis.SpriteAnimSet = SpriteAnimSet;
  // This is used by the dev/printablepreview page.
  globalThis.enginesData = enginesData;
}
module.exports = {
  initialize: initialize,
  PageChapter: __webpack_require__(/*! ./reactView/PageChapter.jsx */ "./src/trainer/reactView/PageChapter.jsx"),
  PageProblem: __webpack_require__(/*! ./reactView/PageProblem.jsx */ "./src/trainer/reactView/PageProblem.jsx"),
  PageHistory: __webpack_require__(/*! ./reactView/PageHistory.jsx */ "./src/trainer/reactView/PageHistory.jsx"),
  PageDevProblem: __webpack_require__(/*! ./reactView/PageDevProblem.jsx */ "./src/trainer/reactView/PageDevProblem.jsx"),
  PageDevEngineTester: __webpack_require__(/*! ./reactView/PageDevEngineTester.jsx */ "./src/trainer/reactView/PageDevEngineTester.jsx"),
  DevProblemList: __webpack_require__(/*! ./reactView/DevProblemList.jsx */ "./src/trainer/reactView/DevProblemList.jsx"),
  OpsResult: __webpack_require__(/*! ./vault/OpsResult.js */ "./src/trainer/vault/OpsResult.js"),
  OpsProblem: __webpack_require__(/*! ./vault/OpsProblem.js */ "./src/trainer/vault/OpsProblem.js"),
  InstructionsUtil: __webpack_require__(/*! ./util/InstructionsUtil.js */ "./src/trainer/util/InstructionsUtil.js"),
  Banvas: __webpack_require__(/*! ./Banvas.js */ "./src/trainer/Banvas.js"),
  ResultBanvas: __webpack_require__(/*! ./util/LegacyResultBanvas.js */ "./src/trainer/util/LegacyResultBanvas.js")
};

/***/ },

/***/ "./src/trainer/reactView/ChapterPathBackgroundHall.jsx"
/*!*************************************************************!*\
  !*** ./src/trainer/reactView/ChapterPathBackgroundHall.jsx ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var ChapterPathUtil = __webpack_require__(/*! ../../core/util/ChapterPathUtil.js */ "./src/core/util/ChapterPathUtil.js");
var Undraggable = __webpack_require__(/*! ../../core/view/Undraggable.jsx */ "./src/core/view/Undraggable.jsx");
var styles = __webpack_require__(/*! ./styles/ChapterPathBackgroundHall.css */ "./src/trainer/reactView/styles/ChapterPathBackgroundHall.css");
module.exports = createReactClass({
  displayName: "ChapterPathBackgroundHall",
  propTypes: {
    containerDims: PT.shape({
      width: PT.number.isRequired
    }).isRequired,
    demo: PT.bool,
    gradeNumber: PT.oneOfType([PT.number.isRequired, PT.string.isRequired]),
    isUpstairs: PT.bool,
    pathWidth: PT.number.isRequired,
    roomData: PT.array.isRequired,
    roomPositions: PT.array.isRequired
  },
  getHallCenter: function getHallCenter(leftStart, widthToFill, key) {
    var isLocked = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var _this$props = this.props,
      containerDims = _this$props.containerDims,
      isUpstairs = _this$props.isUpstairs,
      gradeNumber = _this$props.gradeNumber,
      demo = _this$props.demo;
    var widths = ChapterPathUtil.getAdjustedAssetWidths(containerDims.width);
    var _ChapterPathUtil$getB = ChapterPathUtil.getBackgroundAssets("mainhall", {
        isUpstairs: isUpstairs,
        grade: gradeNumber,
        isLocked: isLocked,
        demo: demo
      }),
      segments = _ChapterPathUtil$getB.segments,
      filler = _ChapterPathUtil$getB.filler;
    if (widthToFill < 0) return null;
    // round to nearest half
    var numSegments = Math.round(2 * widthToFill / widths.hallSegment) / 2;
    /**
     * While the room assets are 300px, they overlap such that each additional room only
     * adds 150px to the length of the path, which means the length of the path would be
     * a multiple of 150px. The landscape segments are 300px however, so on average, 50%
     * of the time we need an additional 150px filler element to fill in the gap at the end.
     */
    var needsFiller = numSegments % 1 !== 0;
    if (needsFiller) numSegments -= 0.5;
    var hallImgs = [];
    for (var i = 0; i < numSegments; ++i) {
      var url = segments[i % segments.length];
      var _style = {
        left: leftStart + widths.hallSegment * i
      };
      hallImgs.push(/*#__PURE__*/React.createElement("img", {
        className: styles.img,
        key: "segment" + key + "-" + i,
        src: url,
        style: _style
      }));
    }
    var style = {
      left: leftStart + widths.hallSegment * numSegments
    };
    var elements = /*#__PURE__*/React.createElement(React.Fragment, {
      key: "hall" + key
    }, hallImgs, needsFiller ? /*#__PURE__*/React.createElement("img", {
      className: styles.img,
      key: "filler" + key,
      src: filler,
      style: style
    }) : null);
    return elements;
  },
  render: function render() {
    var _this = this;
    var _this$props2 = this.props,
      isUpstairs = _this$props2.isUpstairs,
      containerDims = _this$props2.containerDims,
      roomPositions = _this$props2.roomPositions,
      pathWidth = _this$props2.pathWidth,
      gradeNumber = _this$props2.gradeNumber,
      roomData = _this$props2.roomData,
      demo = _this$props2.demo;
    var assetWidths = ChapterPathUtil.getAdjustedAssetWidths(containerDims.width);
    var testRoom = assetWidths.testRoom,
      hallEntry = assetWidths.hallEntry,
      hallLeft = assetWidths.hallLeft,
      hallRight = assetWidths.hallRight;
    var unlockedAssets = ChapterPathUtil.getBackgroundAssets("mainhall", {
      isUpstairs: isUpstairs,
      grade: gradeNumber,
      demo: demo
    });
    var lockedAssets = ChapterPathUtil.getBackgroundAssets("mainhall", {
      isUpstairs: isUpstairs,
      grade: gradeNumber,
      isLocked: true,
      demo: demo
    });
    var hallImgs;
    if (isUpstairs) {
      // upstairs are separate hallways between each set of stairs
      var stairs = [];
      var stairIndices = [];
      roomPositions.forEach(function (r, i) {
        if (r.isStaircase) {
          stairs.push(r);
          stairIndices.push(i);
        }
      });
      hallImgs = stairs.map(function (s, i) {
        var correspBlocks = ChapterPathUtil.getBlocksForStairs(roomData, stairIndices[i], isUpstairs);
        var isLocked = !ChapterPathUtil.staircaseIsUnlocked(correspBlocks);
        var assets = isLocked ? lockedAssets : unlockedAssets;
        var fillTo = stairs[i + 1] ? stairs[i + 1].left : pathWidth;
        var widthToFill = fillTo - s.left - hallLeft - hallRight;
        var hallCenter = _this.getHallCenter(hallLeft + s.left, widthToFill, "stair".concat(i), isLocked);
        var needsOffset = i === 0 && s.cardinal === "south";
        var invisible = /*#__PURE__*/React.createElement("img", {
          className: styles.img,
          key: "invisible".concat(i),
          src: unlockedAssets.invisible
        });
        return /*#__PURE__*/React.createElement(Undraggable, {
          key: "upstairsHall".concat(i)
        }, needsOffset ? invisible : null, /*#__PURE__*/React.createElement("img", {
          className: styles.img,
          key: "left".concat(i),
          src: assets.left,
          style: {
            left: s.left
          }
        }), hallCenter, /*#__PURE__*/React.createElement("img", {
          className: styles.img,
          key: "right".concat(i),
          src: assets.right,
          style: {
            left: s.left + widthToFill + hallLeft
          }
        }));
      });
    } else {
      // downstairs is a single hallway
      var allRoomsLocked = _.every(roomData, function (r) {
        return _.isArray(r) ? !ChapterPathUtil.staircaseIsUnlocked(r) : !r.unlocked;
      });
      var assets = allRoomsLocked ? lockedAssets : unlockedAssets;
      var widthToFill = pathWidth - hallEntry - testRoom / 2;
      var style = {
        left: 0
      };
      hallImgs = /*#__PURE__*/React.createElement(Undraggable, {
        key: "downstairsHall"
      }, /*#__PURE__*/React.createElement("img", {
        className: styles.img,
        key: "mainentry-downstairs",
        src: assets.entry,
        style: style
      }), this.getHallCenter(hallEntry, widthToFill, "downstairs", allRoomsLocked));
    }
    return /*#__PURE__*/React.createElement("div", {
      className: styles.chapterPathBackgroundHall
    }, hallImgs);
  }
});

/***/ },

/***/ "./src/trainer/reactView/ChapterPathBackgroundLandscape.jsx"
/*!******************************************************************!*\
  !*** ./src/trainer/reactView/ChapterPathBackgroundLandscape.jsx ***!
  \******************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var ChapterPathUtil = __webpack_require__(/*! ../../core/util/ChapterPathUtil.js */ "./src/core/util/ChapterPathUtil.js");
var Undraggable = __webpack_require__(/*! ../../core/view/Undraggable.jsx */ "./src/core/view/Undraggable.jsx");
var styles = __webpack_require__(/*! ./styles/ChapterPathBackgroundLandscape.css */ "./src/trainer/reactView/styles/ChapterPathBackgroundLandscape.css");
module.exports = createReactClass({
  displayName: "ChapterPathBackgroundLandscape",
  propTypes: {
    containerDims: PT.shape({
      width: PT.number.isRequired
    }).isRequired,
    demo: PT.bool,
    gradeNumber: PT.number,
    isUpstairs: PT.bool,
    pathWidth: PT.number.isRequired
  },
  getLandscapeImages: function getLandscapeImages() {
    var _this$props = this.props,
      pathWidth = _this$props.pathWidth,
      containerDims = _this$props.containerDims,
      gradeNumber = _this$props.gradeNumber,
      demo = _this$props.demo;
    var assetWidths = ChapterPathUtil.getAdjustedAssetWidths(containerDims.width);
    // to make calling these easier lol
    var widths = {
      entry: assetWidths.landscapeEntry,
      segment: assetWidths.landscapeSegment,
      filler: assetWidths.landscapeFiller,
      exit: assetWidths.landscapeExit
    };
    var assets = ChapterPathUtil.getBackgroundAssets("landscape", {
      grade: gradeNumber,
      demo: demo
    });
    var widthToFill = pathWidth - widths.entry - widths.exit;
    // round to nearest half
    var numSegments = Math.round(2 * widthToFill / widths.segment) / 2;
    /**
     * While the room assets are 300px, they overlap such that each additional room only
     * adds 150px to the length of the path, which means the length of the path would be
     * a multiple of 150px. The landscape segments are 300px however, so on average, 50%
     * of the time we need an additional 150px filler element to fill in the gap at the end.
     */
    var needsFiller = numSegments % 1 !== 0;
    if (needsFiller) numSegments -= 0.5;
    var imgs = [];
    for (var i = 0; i < numSegments; ++i) {
      var url = assets.segments[i % assets.segments.length];
      var style = {
        left: widths.entry + widths.segment * i
      };
      imgs.push(/*#__PURE__*/React.createElement("img", {
        className: styles.img,
        key: i,
        src: url,
        style: style
      }));
    }
    var entryLeft = 0;
    var fillerLeft = widths.entry + widths.segment * numSegments;
    var exitLeft = fillerLeft + (needsFiller ? widths.filler : 0);
    return /*#__PURE__*/React.createElement(Undraggable, null, /*#__PURE__*/React.createElement("img", {
      className: styles.img,
      src: assets.entry,
      style: {
        left: entryLeft
      }
    }), imgs, needsFiller ? /*#__PURE__*/React.createElement("img", {
      className: styles.img,
      src: assets.filler,
      style: {
        left: fillerLeft
      }
    }) : null, /*#__PURE__*/React.createElement("img", {
      className: styles.img,
      src: assets.exit,
      style: {
        left: exitLeft
      }
    }));
  },
  render: function render() {
    var imgs = this.getLandscapeImages();
    return /*#__PURE__*/React.createElement("div", {
      className: styles.chapterPathBackgroundLandscape
    }, imgs);
  }
});

/***/ },

/***/ "./src/trainer/reactView/ChapterPathBackgroundRoofline.jsx"
/*!*****************************************************************!*\
  !*** ./src/trainer/reactView/ChapterPathBackgroundRoofline.jsx ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var ChapterPathUtil = __webpack_require__(/*! ../../core/util/ChapterPathUtil.js */ "./src/core/util/ChapterPathUtil.js");
var Undraggable = __webpack_require__(/*! ../../core/view/Undraggable.jsx */ "./src/core/view/Undraggable.jsx");
var styles = __webpack_require__(/*! ./styles/ChapterPathBackgroundRoofline.css */ "./src/trainer/reactView/styles/ChapterPathBackgroundRoofline.css");
module.exports = createReactClass({
  displayName: "ChapterPathBackgroundRoofline",
  propTypes: {
    containerDims: PT.shape({
      width: PT.number.isRequired
    }).isRequired,
    gradeNumber: PT.number,
    isUpstairs: PT.bool,
    pathWidth: PT.number.isRequired
  },
  getRooflineImages: function getRooflineImages() {
    var _this$props = this.props,
      pathWidth = _this$props.pathWidth,
      containerDims = _this$props.containerDims,
      isUpstairs = _this$props.isUpstairs,
      gradeNumber = _this$props.gradeNumber;
    if (!isUpstairs) {
      return null;
    }
    var _ChapterPathUtil$getA = ChapterPathUtil.getAdjustedAssetWidths(containerDims.width),
      rooflineWidth = _ChapterPathUtil$getA.roofline;
    var _ChapterPathUtil$getB = ChapterPathUtil.getBackgroundAssets("upstairs", {
        grade: gradeNumber
      }),
      roofline = _ChapterPathUtil$getB.roofline;
    var numImgs = Math.ceil(pathWidth / rooflineWidth);
    var imgs = [];
    for (var i = 0; i < numImgs; ++i) {
      var style = {
        left: rooflineWidth * i
      };
      imgs.push(/*#__PURE__*/React.createElement("img", {
        className: styles.img,
        key: i,
        src: roofline,
        style: style
      }));
    }
    return imgs;
  },
  render: function render() {
    var imgs = this.getRooflineImages();
    return /*#__PURE__*/React.createElement(Undraggable, null, /*#__PURE__*/React.createElement("div", {
      className: styles.chapterPathBackgroundRoofline
    }, imgs));
  }
});

/***/ },

/***/ "./src/trainer/reactView/ChapterPathBuilding.jsx"
/*!*******************************************************!*\
  !*** ./src/trainer/reactView/ChapterPathBuilding.jsx ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

/**
 * NOTE: Despite what the name of this view may suggest, hallway assets are NOT
 * part of this view. Hall assets are their own entity, while this view contains
 * every other part of the chapter building (namely rooms and staircases).
 */

var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var ChapterPathUtil = __webpack_require__(/*! ../../core/util/ChapterPathUtil.js */ "./src/core/util/ChapterPathUtil.js");
var OpsUser = __webpack_require__(/*! ../../core/vault/OpsUser.js */ "./src/core/vault/OpsUser.js");
var dbDemoData = __webpack_require__(/*! ../../../shared/data/dbDemoData.json */ "./shared/data/dbDemoData.json");
var TrainerCore = __webpack_require__(/*! ../../../shared/TrainerCore.js */ "./shared/TrainerCore.js");
var Avatar = __webpack_require__(/*! ../../core/view/Avatar.jsx */ "./src/core/view/Avatar.jsx");
var ChapterPathRoom = __webpack_require__(/*! ./ChapterPathRoom.jsx */ "./src/trainer/reactView/ChapterPathRoom.jsx");
var ChapterPathStaircase = __webpack_require__(/*! ./ChapterPathStaircase.jsx */ "./src/trainer/reactView/ChapterPathStaircase.jsx");
var ChapterPathDottedPath = __webpack_require__(/*! ./ChapterPathDottedPath.jsx */ "./src/trainer/reactView/ChapterPathDottedPath.jsx");
var withAnimateRef = __webpack_require__(/*! ../../core/hoc/withAnimateRef.jsx */ "./src/core/hoc/withAnimateRef.jsx");
var WebAnimations = __webpack_require__(/*! ../../core/util/WebAnimations.js */ "./src/core/util/WebAnimations.js");
var Sounds = __webpack_require__(/*! ../../core/util/Sounds.js */ "./src/core/util/Sounds.js");
module.exports = withAnimateRef(createReactClass({
  displayName: "ChapterPathBuilding",
  animating: false,
  preppingAnimation: false,
  propTypes: {
    animations: PT.array.isRequired,
    prepAnimations: PT.array.isRequired,
    canClick: PT.func.isRequired,
    chapter: PT.object.isRequired,
    containerDims: PT.shape({
      width: PT.number.isRequired
    }).isRequired,
    demo: PT.bool.isRequired,
    isUpstairs: PT.bool.isRequired,
    lessonPromptID: PT.number.isRequired,
    numUnfinishedBlocks: PT.number.isRequired,
    openBook: PT.func.isRequired,
    roomData: PT.array.isRequired,
    roomPositions: PT.array.isRequired,
    showLessonPrompt: PT.func.isRequired,
    skipUnfinishedMessage: PT.bool.isRequired,
    takeStairs: PT.func.isRequired,
    user: PT.object.isRequired,
    avatarPositionData: PT.object,
    avatarPositionInfo: PT.object,
    userAssignedBlocks: PT.object,
    // Injected by HOCs
    animateRef: PT.func.isRequired
  },
  getHomeworkData: function getHomeworkData(blockModel) {
    var _this$props = this.props,
      userAssignedBlocks = _this$props.userAssignedBlocks,
      user = _this$props.user;
    var blockID = blockModel.blockID;
    var _$get = _.get(userAssignedBlocks, [blockID], {}),
      isReleased = _$get.isReleased,
      isAssigned = _$get.isAssigned;
    if (!isReleased || !isAssigned) return null;
    return OpsUser.getHomeworkDataForBlock(user, blockModel);
  },
  render: function render() {
    var _this$state,
      _this$state2,
      _this = this;
    var _this$props2 = this.props,
      containerDims = _this$props2.containerDims,
      demo = _this$props2.demo,
      user = _this$props2.user,
      roomData = _this$props2.roomData,
      roomPositions = _this$props2.roomPositions,
      avatarPositionData = _this$props2.avatarPositionData,
      avatarPositionInfo = _this$props2.avatarPositionInfo,
      takeStairs = _this$props2.takeStairs,
      isUpstairs = _this$props2.isUpstairs,
      openBook = _this$props2.openBook,
      chapter = _this$props2.chapter,
      showLessonPrompt = _this$props2.showLessonPrompt,
      lessonPromptID = _this$props2.lessonPromptID,
      canClick = _this$props2.canClick;
    var chapterModel = _.get(chapter, "model") || {};
    var gradeNumber = demo ? null : chapterModel.gradeNumber;
    var elements = [];
    var stairIndex = 0;
    var buildingUnlocked = demo ? true : ChapterPathUtil.buildingIsUnlocked(chapterModel);
    var animBeat = ((_this$state = this.state) === null || _this$state === void 0 || (_this$state = _this$state.animationInfo) === null || _this$state === void 0 ? void 0 : _this$state.beat) || 0;
    var anim = (_this$state2 = this.state) === null || _this$state2 === void 0 || (_this$state2 = _this$state2.animationInfo) === null || _this$state2 === void 0 ? void 0 : _this$state2.anim;
    var setAnimatedRoom = function setAnimatedRoom(rr) {
      var isUnlocking = false;
      var isJustFinished = false;
      if (rr.isReading) {
        isJustFinished = anim.room.bookSectionID === rr.bookSectionID;
        if (anim.roomsUnlocked) {
          isUnlocking = anim.roomsUnlocked.some(function (unlockedRoom) {
            return unlockedRoom.type === "reading" && unlockedRoom.bookSectionID === rr.bookSectionID;
          });
        }
      } else {
        var isSameRoom = function isSameRoom(r1, r2) {
          return r1 && r2 && r1.blockIndex === r2.blockIndex && r1.chapterIndex === r2.chapterIndex && r1.gradeNumber === r2.gradeNumber;
        };
        isJustFinished = isSameRoom(anim.room, rr);
        if (anim.roomsUnlocked) {
          isUnlocking = anim.roomsUnlocked.some(function (unlockedRoom) {
            return isSameRoom(unlockedRoom, rr);
          });
        }
      }
      if (animBeat < 1 && isJustFinished) {
        rr.isComplete = anim.wasComplete;
        rr.starsObtained = anim.prevStars;
        if (anim.earnedTrophy) {
          rr.isTrophyComplete = false;
          rr.trophies = 0;
        }
      }
      if (animBeat < 3 && isUnlocking) {
        rr.unlocked = false;
      }
    };
    var key = ChapterPathUtil.getFloorStr(isUpstairs);
    // VC only - get the number of blocks necessary to unlock the test
    chapter.blocksNeededForTest = TrainerCore.getBlocksUntilTestUnlock(roomData);
    _.each(roomData, function (r, i) {
      var pos = roomPositions[i];
      r = _.cloneDeep(r);
      if (anim && anim.type === "earned-something") {
        if (ChapterPathUtil.blockIsStaircase(r)) {
          r.forEach(setAnimatedRoom);
        } else {
          setAnimatedRoom(r);
        }
      }
      if (ChapterPathUtil.blockIsStaircase(r)) {
        // for staircase
        var correspBlocks = ChapterPathUtil.getBlocksForStairs(roomData, i, isUpstairs);
        var upstairsBlocks = isUpstairs ? correspBlocks : r;
        var downstairsBlocks = isUpstairs ? r : correspBlocks;
        var homeworkData = isUpstairs ? null : upstairsBlocks.map(function (b) {
          return _this.getHomeworkData(b);
        });
        elements.push(/*#__PURE__*/React.createElement(ChapterPathStaircase, {
          key: "".concat(key).concat(i),
          downstairsBlockModels: downstairsBlocks,
          upstairsBlockModels: upstairsBlocks,
          canClick: canClick,
          cardinal: pos.cardinal,
          gradeNumber: gradeNumber,
          isUpstairs: isUpstairs,
          leftStyle: pos.left,
          stairIndex: stairIndex,
          takeStairs: takeStairs,
          width: pos.width,
          homeworkData: homeworkData
        }));
        ++stairIndex;
        var isUnlocked = ChapterPathUtil.staircaseIsUnlocked(upstairsBlocks);
        if (isUpstairs || isUnlocked) {
          elements.push(/*#__PURE__*/React.createElement(ChapterPathDottedPath, {
            key: "".concat(key, "Path").concat(i),
            cardinal: pos.cardinal,
            containerDims: containerDims,
            demo: demo,
            gradeNumber: gradeNumber,
            isLocked: !isUnlocked,
            isUpstairs: isUpstairs,
            leftStyle: pos.left,
            isForStaircase: true
            // if right before test room - note that there's a test room and a faux post-test room
            ,
            useShortPath: !isUpstairs && i === roomData.length - 3
          }));
        }
      } else if (TrainerCore.isTestBlock(r)) {
        var isComplete = ChapterPathUtil.blockIsComplete(r);
        elements.push(/*#__PURE__*/React.createElement(ChapterPathRoom, {
          key: "testRoom",
          blockModel: r,
          canClick: canClick,
          chapter: chapter,
          demo: demo,
          leftStyle: pos.left,
          user: user,
          width: pos.width,
          homeworkData: _this.getHomeworkData(r)
        }));
        elements.push(/*#__PURE__*/React.createElement(ChapterPathDottedPath, {
          key: "".concat(key, "Path").concat(i),
          cardinal: pos.cardinal,
          containerDims: containerDims,
          demo: demo,
          gradeNumber: gradeNumber,
          isComplete: isComplete,
          isLocked: !buildingUnlocked,
          isTest: true,
          isUpstairs: isUpstairs,
          leftStyle: pos.left,
          roomIsUnlocked: r.unlocked
        }));
      } else if (ChapterPathUtil.blockIsFaux(r)) {
        // no-op - don't render anything
      } else {
        elements.push(/*#__PURE__*/React.createElement(ChapterPathRoom, {
          key: "".concat(key).concat(i),
          blockModel: r,
          canClick: canClick,
          chapter: chapter,
          demo: demo,
          leftStyle: pos.left,
          user: user,
          width: pos.width,
          cardinal: pos.cardinal,
          homeworkData: _this.getHomeworkData(r),
          isUpstairs: isUpstairs,
          lessonPromptID: lessonPromptID,
          openBook: openBook,
          showLessonPrompt: showLessonPrompt
        }));
        var needsEnd = isUpstairs && (i === roomData.length - 1 || ChapterPathUtil.blockIsStaircase(roomData[i + 1]));
        // don't render the path upstairs if it's right after staircase
        var hidePath = isUpstairs && i > 0 && ChapterPathUtil.blockIsStaircase(roomData[i - 1]);
        var isLocked = !buildingUnlocked;
        if (isUpstairs) {
          var chunk = ChapterPathUtil.getChunkForBlock(roomData, i);
          isLocked = !ChapterPathUtil.staircaseIsUnlocked(chunk);
        }
        elements.push(/*#__PURE__*/React.createElement(ChapterPathDottedPath, {
          key: "".concat(key, "Path").concat(i),
          cardinal: pos.cardinal,
          containerDims: containerDims,
          demo: demo,
          gradeNumber: gradeNumber,
          isLocked: isLocked,
          isUpstairs: isUpstairs,
          leftStyle: pos.left,
          hidePath: hidePath,
          isStart: i === 0,
          needsEnd: needsEnd
        }));
      }
    });
    var avatar = null;
    if (_.isObject(avatarPositionData) && _.isObject(avatarPositionInfo) && !!isUpstairs === !!avatarPositionData.isUpstairs) {
      var avatarModel = demo ? dbDemoData.avatarModel : user.model.avatar;
      var fauxAvatarModel = _.extend({}, avatarModel, {
        color: "#FFFFFF" // force white background
      });
      var avatarStyle = {
        left: "calc(".concat(avatarPositionInfo.currLoc.beforeX, "px - 4.25rem)"),
        top: "calc(".concat(avatarPositionInfo.currLoc.beforeY, "px - 4.25rem)"),
        position: "absolute",
        width: "8.5rem",
        height: "8.5rem",
        zIndex: 8
      };
      avatar = /*#__PURE__*/React.createElement(Avatar, {
        ref: function ref(c) {
          if (!c || _this.animating) {
            return;
          }
          var aRef = c.getRef();
          var hasAnimation = function hasAnimation(type) {
            return _this.props.animations.filter(function (a) {
              return a.type === type;
            }).length;
          };
          var hasPrepAnimation = function hasPrepAnimation(type) {
            return _this.props.prepAnimations.filter(function (a) {
              return a.type === type;
            }).length;
          };
          if (aRef) {
            if (!hasAnimation("earned-something") && hasPrepAnimation("earned-something") && !_this.preppingAnimation) {
              // If we're about to do an earn-something animation, get ready to do it.
              // This will make sure that the avatar is positioned properly and assets are correct versions
              // while e.g. waiting for a modal to close.
              var earnAnim = _this.props.prepAnimations.filter(function (a) {
                return a.type === "earned-something";
              })[0];
              _this.preppingAnimation = true;
              _this.setState({
                animationInfo: {
                  beat: 0,
                  anim: earnAnim
                }
              });
              return;
            } else if (hasAnimation("earned-something")) {
              var _earnAnim = _this.props.animations.filter(function (a) {
                return a.type === "earned-something";
              })[0];
              var hopOntoRoom = function hopOntoRoom(next) {
                setTimeout(function () {
                  Sounds.playSound("cpv-hop");
                }, 350);
                _this.setState({
                  animationInfo: {
                    beat: 0,
                    anim: _earnAnim
                  }
                });
                _this.props.animateRef(aRef, WebAnimations.chapterPath.earnSomething.hopOntoRoom.makeKeyframes(avatarPositionInfo), WebAnimations.chapterPath.earnSomething.hopOntoRoom.options, next);
              };
              var swapRoomAsset = function swapRoomAsset(next) {
                Sounds.playSound("cpv-award");
                _this.setState({
                  animationInfo: {
                    beat: 1,
                    anim: _earnAnim
                  }
                });
                next();
              };
              var hopOffRoom = function hopOffRoom(next) {
                setTimeout(function () {
                  Sounds.playSound("cpv-hop");
                }, 350);
                _this.setState({
                  animationInfo: {
                    beat: 2,
                    anim: _earnAnim
                  }
                });
                _this.props.animateRef(aRef, WebAnimations.chapterPath.earnSomething.hopOffRoom.makeKeyframes(avatarPositionInfo), WebAnimations.chapterPath.earnSomething.hopOffRoom.options, next);
              };
              var swapAssetsForUnlock = function swapAssetsForUnlock(next) {
                if (_earnAnim.roomsUnlocked && _earnAnim.roomsUnlocked.length || _earnAnim.unlockedTrophy) {
                  Sounds.playSound("cpv-snap");
                }
                _this.setState({
                  animationInfo: {
                    beat: 3,
                    anim: _earnAnim
                  }
                });
                next();
              };
              var queue = [hopOntoRoom, swapRoomAsset, hopOffRoom, swapAssetsForUnlock];
              var _doBeat = function doBeat() {
                _this.animating = true;
                if (queue.length) {
                  queue.shift()(_doBeat);
                } else {
                  _this.animating = false;
                }
              };
              _doBeat();
            } else if (hasAnimation("look-at-me")) {
              setTimeout(function () {
                Sounds.playSound("cpv-hop");
              }, 350);
              _this.props.animateRef(aRef, WebAnimations.chapterPath.lookAtMe.keyframes, WebAnimations.chapterPath.lookAtMe.options, function () {
                _this.animating = false;
              });
              _this.animating = true;
            } else if (!_this.animating && hasAnimation("idle-bounce")) {
              // TODO: figure out if we want sound effect here
              // setTimeout(() => {
              // 	Sounds.playSound("cpv-hop");
              // }, 350);
              _this.props.animateRef(aRef, WebAnimations.chapterPath.idleBounce.keyframes, WebAnimations.chapterPath.idleBounce.options, function () {
                _this.animating = false;
              });
              _this.animating = true;
            }
            if (_this.animating) {
              _this.preppingAnimation = false;
            }
          }
        },
        style: avatarStyle,
        className: "avatar",
        avatar: fauxAvatarModel,
        backgroundType: "opaque",
        clickThrough: true
      });
    }
    return /*#__PURE__*/React.createElement(React.Fragment, null, elements, avatar);
  }
}));

/***/ },

/***/ "./src/trainer/reactView/ChapterPathContainer.jsx"
/*!********************************************************!*\
  !*** ./src/trainer/reactView/ChapterPathContainer.jsx ***!
  \********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var withContainerDims = __webpack_require__(/*! ../../core/hoc/withContainerDims.jsx */ "./src/core/hoc/withContainerDims.jsx");
var AT = __webpack_require__(/*! ../../core/vault/ActionTypes.js */ "./src/core/vault/ActionTypes.js");
var withVaultDispatch = __webpack_require__(/*! ../../core/hoc/withVaultDispatch.jsx */ "./src/core/hoc/withVaultDispatch.jsx");
var withVaultUpdate = __webpack_require__(/*! ../../core/hoc/withVaultUpdate.jsx */ "./src/core/hoc/withVaultUpdate.jsx");
var _require = __webpack_require__(/*! ../../core/vault/StateCursors.js */ "./src/core/vault/StateCursors.js"),
  atChapterPath = _require.atChapterPath,
  atDemoData = _require.atDemoData,
  atPage = _require.atPage;
var _require2 = __webpack_require__(/*! ../../core/util/HOCUtil.js */ "./src/core/util/HOCUtil.js"),
  getBaseInstance = _require2.getBaseInstance;
var AssetsUtil = __webpack_require__(/*! ../../core/util/AssetsUtil.js */ "./src/core/util/AssetsUtil.js");
var ChapterPathUtil = __webpack_require__(/*! ../../core/util/ChapterPathUtil.js */ "./src/core/util/ChapterPathUtil.js");
var CopyTable = __webpack_require__(/*! ../../core/util/CopyTable.js */ "./src/core/util/CopyTable.js");
var ErrorUtil = __webpack_require__(/*! ../../../shared/ErrorUtil.js */ "./shared/ErrorUtil.js");
var Sounds = __webpack_require__(/*! ../../core/util/Sounds.js */ "./src/core/util/Sounds.js");
var TrainerCore = __webpack_require__(/*! ../../../shared/TrainerCore.js */ "./shared/TrainerCore.js");
var ChapterPathBackgroundHall = __webpack_require__(/*! ./ChapterPathBackgroundHall.jsx */ "./src/trainer/reactView/ChapterPathBackgroundHall.jsx");
var ChapterPathBackgroundLandscape = __webpack_require__(/*! ./ChapterPathBackgroundLandscape.jsx */ "./src/trainer/reactView/ChapterPathBackgroundLandscape.jsx");
var ChapterPathBackgroundRoofline = __webpack_require__(/*! ./ChapterPathBackgroundRoofline.jsx */ "./src/trainer/reactView/ChapterPathBackgroundRoofline.jsx");
var ChapterPathBuilding = __webpack_require__(/*! ./ChapterPathBuilding.jsx */ "./src/trainer/reactView/ChapterPathBuilding.jsx");
var ChapterPathFindMyAvatarButton = __webpack_require__(/*! ./ChapterPathFindMyAvatarButton.jsx */ "./src/trainer/reactView/ChapterPathFindMyAvatarButton.jsx");
var ChapterPathNavigationButton = __webpack_require__(/*! ./ChapterPathNavigationButton.jsx */ "./src/trainer/reactView/ChapterPathNavigationButton.jsx");
var IconButton = __webpack_require__(/*! ../../../src/core/view/IconButton.jsx */ "./src/core/view/IconButton.jsx");
var ScrollArea = __webpack_require__(/*! ../../core/view/ScrollArea.jsx */ "./src/core/view/ScrollArea.jsx");
var SliderController = __webpack_require__(/*! ../../core/view/SliderController.jsx */ "./src/core/view/SliderController.jsx");
var LoadGuard = __webpack_require__(/*! ../../core/view/LoadGuard.jsx */ "./src/core/view/LoadGuard.jsx");
var scrollTheme = __webpack_require__(/*! ./styles/ChapterPathScrollTheme.css */ "./src/trainer/reactView/styles/ChapterPathScrollTheme.css");
var styles = __webpack_require__(/*! ./styles/ChapterPathContainer.css */ "./src/trainer/reactView/styles/ChapterPathContainer.css");
var WebAnimations = __webpack_require__(/*! ../../core/util/WebAnimations.js */ "./src/core/util/WebAnimations.js");

// Helper for HOC setup
var getPropsFromVault = function getPropsFromVault(props, vaultState) {
  var chapterPath = atChapterPath(vaultState).get();
  var page = atPage(vaultState).get();
  var _chapterPath$canAnima = chapterPath.canAnimate,
    canAnimate = _chapterPath$canAnima === void 0 ? false : _chapterPath$canAnima,
    rooms = chapterPath.rooms;
  var avatar = chapterPath.avatar || {};
  var demoAvatarModel = atDemoData(vaultState).getIn("avatarModel");
  return {
    avatar: avatar,
    canAnimate: canAnimate,
    chapterPath: chapterPath,
    demoAvatarModel: demoAvatarModel,
    page: page,
    rooms: rooms
  };
};

// Helper to apply higher-order components.
var augment = function augment(Component) {
  Component = withContainerDims(Component);
  Component = withVaultDispatch(Component);
  Component = withVaultUpdate(Component, getPropsFromVault);
  return Component;
};
module.exports = augment(createReactClass({
  displayName: "ChapterPathContainer",
  propTypes: {
    chapter: PT.object.isRequired,
    demo: PT.bool.isRequired,
    libraryChapter: PT.object.isRequired,
    numUnfinishedBlocks: PT.number.isRequired,
    skipUnfinishedMessage: PT.bool.isRequired,
    user: PT.object.isRequired,
    nextChapter: PT.object,
    previousChapter: PT.object,
    userAssignedBlocks: PT.object,
    // Injected by HOCs
    avatar: PT.object.isRequired,
    canAnimate: PT.bool.isRequired,
    chapterPath: PT.object.isRequired,
    demoAvatarModel: PT.object,
    // required if demo
    page: PT.object.isRequired,
    rooms: PT.object.isRequired,
    dispatch: PT.func.isRequired,
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
    this.justSwitchedFloors = false;
    return {
      isUpstairs: false,
      // if true, on visit of a chapter with an avatar, we should bring it into view
      scrollToAvatar: false,
      // The blockID for which the lesson prompt is showing (for trophy)
      lessonPromptID: 0,
      // slider info
      sliderGeneration: 0,
      sliderBlockName: "",
      idleAnimate: false
    };
  },
  componentDidMount: function componentDidMount() {
    var _this$props = this.props,
      chapter = _this$props.chapter,
      demo = _this$props.demo;
    this.maybeShowSplashScreen();
    var avatar = _.get(this.props, "avatar", {});
    var avatarChapterID = avatar.chapterID;
    if (demo || avatarChapterID === chapter.chapterID) {
      this.scrollToAvatar();
    }
    this.setIdleTimeout();
  },
  setIdleTimeout: function setIdleTimeout() {
    var _this = this;
    this.idleTimeout = setTimeout(function () {
      _this.setState({
        idleAnimate: true
      });
      requestAnimationFrame(function () {
        _this.setState({
          idleAnimate: false
        });
        _this.setIdleTimeout();
      });
    }, 1000 * WebAnimations.chapterPath.idleBounce.secondsBeforeNextBounce());
  },
  componentWillUnmount: function componentWillUnmount() {
    clearTimeout(this.idleTimeout);
  },
  clearAnimations: function clearAnimations() {
    this.props.dispatch({
      type: AT.CLEAR_CHAPTER_PATH_ANIMATIONS
    });
  },
  maybeShowSplashScreen: function maybeShowSplashScreen() {
    var _this2 = this;
    if (this.state.clearAnim) {
      this.setState({
        animations: null,
        clearAnim: false
      });
    }
    if (!this.state.splashing) {
      var chapterPath = this.props.chapterPath;
      var allAnimationTriggers = [].concat(_toConsumableArray(chapterPath.animationTriggers), _toConsumableArray(ChapterPathUtil.computeStateAnimationTriggers(this)));
      var splashes = ChapterPathUtil.expandSplashes(allAnimationTriggers);
      if (splashes.length) {
        var animations = ChapterPathUtil.expandAnimations(allAnimationTriggers);
        this.setState({
          splashes: splashes,
          splashing: true
        });
        this.clearAnimations();
        setTimeout(function () {
          _this2.setState({
            splashes: [],
            splashing: false,
            animations: animations,
            clearAnim: true
          });
        }, 400);
      }
    }
  },
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    this.maybeShowSplashScreen();
    var animations = this.state.animations;
    var scrollToAvatar = this.state.scrollToAvatar || animations && animations.filter(function (a) {
      return a.type === "look-at-me";
    }).length;
    var prevAvatarData = _.get(prevProps, "avatar", {});
    var currAvatarData = _.get(this.props, "avatar", {});
    if (scrollToAvatar || !_.isEqual(prevAvatarData, currAvatarData)) {
      if (this.justSwitchedFloors) {
        // Don't scroll to avatar if we just switched floors.
        this.justSwitchedFloors = false;
      } else {
        this.scrollToAvatar();
      }
    }
  },
  vaultEvents: {
    showChapterSlider: function showChapterSlider(sliderInfo) {
      this.setState({
        sliderGeneration: this.state.sliderGeneration + 1,
        sliderInfo: sliderInfo
      });
    },
    openedReadingModal: function openedReadingModal() {
      Sounds.stopMusic(true);
    },
    closedReadingModal: function closedReadingModal() {
      Sounds.playMusic("general-background");
    }
  },
  openBook: function openBook(sectionID) {
    this.props.dispatch({
      type: AT.SET_SHOW_BOOK,
      showBook: true,
      sectionID: sectionID
    });
  },
  showLessonPrompt: function showLessonPrompt(blockID) {
    this.setState({
      lessonPromptID: blockID
    });
  },
  getFloorRef: function getFloorRef() {
    var isUpstairs = this.state.isUpstairs;
    var floorStr = ChapterPathUtil.getFloorStr(isUpstairs);
    return this[floorStr + "Ref"];
  },
  /**
   * Helper function to determine if a button can be clicked. Helps
   * separate drags from clicks.
   */
  canClickButton: function canClickButton() {
    var floor = this.getFloorRef();
    if (!floor) {
      return true;
    }
    var hasDragged = floor.state.hasDragged;
    return !hasDragged;
  },
  scrollToXPos: function scrollToXPos(newXPos) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$force = _ref.force,
      force = _ref$force === void 0 ? false : _ref$force;
    this.getFloorRef() && this.getFloorRef().scrollToX(newXPos, {
      force: force
    });
  },
  onSpecialKeys: function onSpecialKeys(axis, code) {
    if (code === "left" || code === "right") {
      this.scrollInDirection(code);
    }
  },
  scrollInDirection: function scrollInDirection(direction) {
    var pathStep = ChapterPathUtil.getAdjustedAssetWidths(this.props.containerDims.width).lessonRoom / 2;
    if (direction === "left") {
      this.updatePathPosition(-pathStep);
    } else {
      this.updatePathPosition(pathStep);
    }
  },
  /**
   * @param {Number} increment Amount to increment by
   * @param {Boolean} absoluteValue If true, treat increment as an absolute value rather than an amount to increment by
   */
  updatePathPosition: function updatePathPosition(increment) {
    var absoluteValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var pathPosition = this.getPathPosition();
    var newPosition = Math.floor(increment + (absoluteValue ? 0 : pathPosition));
    this.scrollToXPos(newPosition);
  },
  renderBackgroundLandscape: function renderBackgroundLandscape(isUpstairs) {
    var _this$props2 = this.props,
      rooms = _this$props2.rooms,
      containerDims = _this$props2.containerDims,
      chapter = _this$props2.chapter,
      demo = _this$props2.demo;
    var roomData = ChapterPathUtil.getRoomsForFloor(rooms, isUpstairs);
    var pathWidth = ChapterPathUtil.getPathWidth(containerDims.width, roomData);
    return /*#__PURE__*/React.createElement(ChapterPathBackgroundLandscape, {
      containerDims: containerDims,
      demo: demo,
      gradeNumber: demo ? null : _.get(chapter, "model.gradeNumber"),
      isUpstairs: isUpstairs,
      pathWidth: pathWidth
    });
  },
  renderBackgroundRoofline: function renderBackgroundRoofline(isUpstairs) {
    var _this$props3 = this.props,
      rooms = _this$props3.rooms,
      containerDims = _this$props3.containerDims,
      chapter = _this$props3.chapter,
      demo = _this$props3.demo;
    var roomData = ChapterPathUtil.getRoomsForFloor(rooms, isUpstairs);
    var pathWidth = ChapterPathUtil.getPathWidth(containerDims.width, roomData);
    return /*#__PURE__*/React.createElement(ChapterPathBackgroundRoofline, {
      containerDims: containerDims,
      gradeNumber: demo ? null : _.get(chapter, "model.gradeNumber"),
      isUpstairs: isUpstairs,
      pathWidth: pathWidth
    });
  },
  renderBackgroundHall: function renderBackgroundHall(isUpstairs) {
    var _this$props4 = this.props,
      rooms = _this$props4.rooms,
      containerDims = _this$props4.containerDims,
      chapter = _this$props4.chapter,
      demo = _this$props4.demo;
    var roomData = ChapterPathUtil.getRoomsForFloor(rooms, isUpstairs);
    var _ChapterPathUtil$getR = ChapterPathUtil.getRoomPositions(roomData, containerDims.width),
      pathWidth = _ChapterPathUtil$getR.pathWidth,
      roomPositions = _ChapterPathUtil$getR.roomPositions;
    return /*#__PURE__*/React.createElement(ChapterPathBackgroundHall, {
      containerDims: containerDims,
      demo: demo,
      gradeNumber: demo ? "" : _.get(chapter, "model.gradeNumber"),
      isUpstairs: isUpstairs,
      pathWidth: pathWidth,
      roomData: roomData,
      roomPositions: roomPositions
    });
  },
  renderChapterPath: function renderChapterPath(isUpstairs) {
    var _this$props5 = this.props,
      user = _this$props5.user,
      rooms = _this$props5.rooms,
      canAnimate = _this$props5.canAnimate,
      chapter = _this$props5.chapter,
      chapterPath = _this$props5.chapterPath,
      userAssignedBlocks = _this$props5.userAssignedBlocks,
      containerDims = _this$props5.containerDims,
      numUnfinishedBlocks = _this$props5.numUnfinishedBlocks,
      skipUnfinishedMessage = _this$props5.skipUnfinishedMessage,
      demo = _this$props5.demo;
    var roomData = ChapterPathUtil.getRoomsForFloor(rooms, isUpstairs);
    var _ChapterPathUtil$getR2 = ChapterPathUtil.getRoomPositions(roomData, containerDims.width),
      roomPositions = _ChapterPathUtil$getR2.roomPositions,
      pathWidth = _ChapterPathUtil$getR2.pathWidth;
    var avatarPositionData = this.getAvatarPositionData();
    var avatarPositionInfo = this.getAvatarPositionInfo();
    var pathStyle = {
      width: pathWidth
    };
    var animations = [];
    var allAnimationTriggers = [].concat(_toConsumableArray(chapterPath.animationTriggers), _toConsumableArray(ChapterPathUtil.computeStateAnimationTriggers(this)));
    var triggeredAnims = ChapterPathUtil.expandAnimations(allAnimationTriggers);
    var queuedAnims = this.state.animations || [];
    animations = [].concat(_toConsumableArray(queuedAnims), _toConsumableArray(triggeredAnims));
    if (canAnimate) {
      if (animations.length > 0) {
        this.clearAnimations();
      }
    }
    return /*#__PURE__*/React.createElement("div", {
      className: styles.building,
      style: pathStyle
    }, /*#__PURE__*/React.createElement(ChapterPathBuilding, {
      canClick: this.canClickButton,
      chapter: chapter,
      containerDims: containerDims,
      demo: demo,
      isUpstairs: isUpstairs,
      lessonPromptID: this.state.lessonPromptID,
      numUnfinishedBlocks: numUnfinishedBlocks,
      openBook: this.openBook,
      roomData: roomData,
      roomPositions: roomPositions,
      showLessonPrompt: this.showLessonPrompt,
      skipUnfinishedMessage: skipUnfinishedMessage,
      takeStairs: this.takeStairs,
      user: user,
      animations: canAnimate ? animations : []
      // include prepAnimations so that it can know what's coming and put itself in the right
      // state of the start of the animation but without actually playing the animation
      ,
      prepAnimations: animations,
      avatarPositionData: avatarPositionData,
      avatarPositionInfo: avatarPositionInfo,
      userAssignedBlocks: userAssignedBlocks
    }), isUpstairs ? null : this.renderChapterNavButtons());
  },
  // animation-related information
  getAvatarPositionInfo: function getAvatarPositionInfo() {
    var _this$props6 = this.props,
      rooms = _this$props6.rooms,
      avatar = _this$props6.avatar,
      containerDims = _this$props6.containerDims,
      chapterPath = _this$props6.chapterPath;
    var animationTriggers = chapterPath.animationTriggers;
    var isUpstairs = avatar.isUpstairs,
      roomIndex = avatar.roomIndex;
    var roomData = ChapterPathUtil.getRoomsForFloor(rooms, isUpstairs);
    if (!_.isArray(roomData) || roomData.length === 0) {
      // exit early if missing room data
      return null;
    }
    var _ChapterPathUtil$getR3 = ChapterPathUtil.getRoomPositions(roomData, containerDims.width),
      roomPositions = _ChapterPathUtil$getR3.roomPositions;
    var locations = roomPositions.map(function (posData) {
      var left = posData.left,
        width = posData.width,
        isFaux = posData.isFaux,
        isStaircase = posData.isStaircase,
        isTest = posData.isTest;
      var rem = 12;
      var yOffset = {
        north: -2.5 * rem,
        south: 7.75 * rem
      }[posData.cardinal];
      if (isStaircase) {
        yOffset = {
          north: -11.5 * rem,
          south: 17 * rem
        }[posData.cardinal];
      } else if (isTest || isFaux) {
        yOffset = 3 * rem;
      }
      var x = left + width / 2;
      var beforeX = left + width / 4;
      if (isTest) {
        x = left + width / 4;
        beforeX = left + width / 8;
      } else if (isFaux) {
        x = left + width * 3 / 4;
        beforeX = x;
      }
      var y = containerDims.height / 2 + yOffset;
      var beforeY = containerDims.height / 2 + 3 * rem;
      return {
        isFaux: isFaux,
        isStaircase: isStaircase,
        isTest: isTest,
        x: x,
        y: y,
        beforeX: beforeX,
        beforeY: beforeY,
        w: width
      };
    });
    var cannotMoveForward = false;
    try {
      cannotMoveForward = animationTriggers.some(function (trigger) {
        return trigger.type === "left-lesson-room" &&
        // departure room and destination room are the same room
        trigger.room.blockIndex === roomData[roomIndex].blockIndex;
      });
    } catch (e) {
      var attrs = ["blockID", "blockIndex", "bookSectionID", "chapterID", "requirementLevel", "isReading", "unlocked"];
      var _trimRoomData = function trimRoomData(data) {
        return _.isArray(data) ? _.map(data, function (d) {
          return _trimRoomData(d);
        }) : _.pick(data, attrs);
      };

      /**
       * UPDATE: This *should* be fixed in https://github.com/aops-ba/ba/pull/4950,
       * but I'm going to leave this in here in case there are other issues.
       */
      ErrorUtil.log(e.name, e.message, {
        animationTriggers: animationTriggers,
        roomIndex: roomIndex,
        isUpstairs: isUpstairs,
        roomData_length: roomData.length,
        trimmedRoomData: _trimRoomData(roomData) // Sentry (or something else) limits the logged characters
      });
    }
    var backwards = false;
    if (isUpstairs && cannotMoveForward) {
      backwards = true;
    }
    var prevRoomIndex = roomIndex - 1;
    // if prev is a staircase, go back 1
    if (ChapterPathUtil.blockIsStaircase(roomData[prevRoomIndex])) {
      prevRoomIndex -= 1;
    }
    // if last in upstairs chunk, make prevRoom same as current
    if (isUpstairs && cannotMoveForward) {
      prevRoomIndex = roomIndex;
    }

    // make sure prev room isn't negative
    prevRoomIndex = Math.max(0, prevRoomIndex);
    return {
      locations: locations,
      currLoc: locations[roomIndex],
      prevLoc: locations[prevRoomIndex],
      backwards: backwards
    };
  },
  // post-animation positioning
  getAvatarPositionData: function getAvatarPositionData() {
    var _this$props7 = this.props,
      chapter = _this$props7.chapter,
      rooms = _this$props7.rooms,
      avatar = _this$props7.avatar,
      containerDims = _this$props7.containerDims,
      demo = _this$props7.demo;
    if (!demo && chapter.chapterID !== avatar.chapterID) return null;
    var roomIndex = avatar.roomIndex,
      isUpstairs = avatar.isUpstairs;
    var roomData = ChapterPathUtil.getRoomsForFloor(rooms, isUpstairs);
    var room = roomData[roomIndex];
    if (!room) return null; // should never happen, but just in case

    var _ChapterPathUtil$getR4 = ChapterPathUtil.getRoomPositions(roomData, containerDims.width),
      roomPositions = _ChapterPathUtil$getR4.roomPositions;
    var positionData = _.clone(roomPositions[roomIndex]);
    var isStairs = ChapterPathUtil.blockIsStaircase(room);
    var isTest = TrainerCore.isTestBlock(room);
    var isFaux = ChapterPathUtil.blockIsFaux(room);
    var left = ChapterPathUtil.getAvatarPosition(positionData.left, containerDims.width, {
      isFaux: isFaux,
      isStairs: isStairs,
      isTest: isTest
    });
    _.extend(positionData, {
      left: left,
      // overwrite room left with avatar left
      isFaux: isFaux,
      isStairs: isStairs,
      isTest: isTest,
      isUpstairs: isUpstairs
    });
    return positionData;
  },
  renderFindMyAvatarButton: function renderFindMyAvatarButton() {
    var _this$props8 = this.props,
      avatar = _this$props8.avatar,
      demo = _this$props8.demo,
      demoAvatarModel = _this$props8.demoAvatarModel,
      user = _this$props8.user;
    return /*#__PURE__*/React.createElement(ChapterPathFindMyAvatarButton, {
      avatar: avatar,
      demo: !!demo,
      user: user,
      className: styles.findMyAvatarIcon,
      demoAvatarModel: demoAvatarModel,
      handleClick: this.findMyAvatarClickHandler
    });
  },
  renderChapterNavButtons: function renderChapterNavButtons() {
    var _this3 = this;
    var _this$props9 = this.props,
      chapter = _this$props9.chapter,
      previousChapter = _this$props9.previousChapter,
      nextChapter = _this$props9.nextChapter,
      user = _this$props9.user;
    var prevButton = /*#__PURE__*/React.createElement(ChapterPathNavigationButton, {
      canClick: this.canClickButton,
      chapter: previousChapter,
      fromChapter: chapter,
      handleClick: function handleClick() {
        return _this3.updateAvatar("previous-chapter");
      },
      navType: "previous",
      user: user
    });
    var nextButton = /*#__PURE__*/React.createElement(ChapterPathNavigationButton, {
      canClick: this.canClickButton,
      chapter: nextChapter,
      fromChapter: chapter,
      handleClick: function handleClick() {
        return _this3.updateAvatar("next-chapter");
      },
      navType: "next",
      user: user
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, prevButton, nextButton);
  },
  updateAvatar: function updateAvatar(navAction) {
    // supported navActions:
    // - "previous-chapter"
    // - "next-chapter"

    var chapterMap = {
      "previous-chapter": this.props.previousChapter,
      "next-chapter": this.props.nextChapter
    };
    var chapter = chapterMap[navAction];
    var chapterModel = _.get(chapter, "model", null);
    if (!_.isObject(chapterModel)) {
      return;
    }
    if (navAction === "previous-chapter") {
      this.getFloorRef().scrollToRight();
    }
    var chapterID = chapterModel.chapterID;
    this.props.dispatch({
      type: AT.UPDATE_CHAPTER_PATH_AVATAR,
      context: {
        navAction: navAction,
        chapterID: chapterID
      }
    });
  },
  // TODO: confirm if can be removed
  renderNavButtons: function renderNavButtons() {
    var _this4 = this;
    var findMyAvatarIcon = this.renderFindMyAvatarButton();
    var clickAction = function clickAction(direction) {
      Sounds.playSound("arrow-" + direction);
      _this4.scrollInDirection(direction);
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      onClick: function onClick() {
        return clickAction("left");
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      iconClass: styles.backPathIcon,
      iconImgPath: AssetsUtil.getButton("left-circle")
    })), /*#__PURE__*/React.createElement("div", {
      onClick: function onClick() {
        return clickAction("right");
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      iconClass: styles.forwardPathIcon,
      iconImgPath: AssetsUtil.getButton("right-circle")
    })), findMyAvatarIcon);
  },
  scrollToAvatar: function scrollToAvatar() {
    var _this5 = this;
    var containerDims = this.props.containerDims;
    var avatarPositionData = this.getAvatarPositionData();
    var left = _.get(avatarPositionData, "left", null);
    if (!_.isNumber(left)) return;
    var isUpstairs = !!_.get(avatarPositionData, "isUpstairs");
    // center on screen (ish)
    var newPathPosition = left - containerDims.width / 2;
    this.setState({
      isUpstairs: isUpstairs,
      scrollToAvatar: false
    }, function () {
      _this5.updatePathPosition(newPathPosition, true);
    });
  },
  findMyAvatarClickHandler: function findMyAvatarClickHandler() {
    this.setState({
      scrollToAvatar: true
    });
  },
  takeStairs: function takeStairs(stairIndex) {
    var _this6 = this;
    this.justSwitchedFloors = true;
    var _this$props0 = this.props,
      containerDims = _this$props0.containerDims,
      rooms = _this$props0.rooms,
      chapter = _this$props0.chapter,
      dispatch = _this$props0.dispatch;
    var newIsUpstairs = !this.state.isUpstairs;
    var currX = this.getPathPosition();
    var position = ChapterPathUtil.calculateNewFloorPosition(containerDims.width, rooms, newIsUpstairs, stairIndex, currX);
    dispatch({
      type: AT.UPDATE_CHAPTER_PATH_AVATAR,
      context: {
        navAction: "take-stairs",
        chapterID: chapter.model.chapterID,
        stairIndex: stairIndex,
        isUpstairs: newIsUpstairs
      }
    });
    this.setState({
      isUpstairs: newIsUpstairs
    }, function () {
      _this6.updatePathPosition(position, true);
    });
  },
  getPathPosition: function getPathPosition() {
    return this.getFloorRef() && this.getFloorRef().getScrollPos()[0];
  },
  render: function render() {
    var _this7 = this;
    if (this.state.splashing) {
      return /*#__PURE__*/React.createElement(LoadGuard, {
        status: {
          load: "none"
        },
        loadingView: "logo",
        logoColorType: "white",
        chapterLoadingBackground: true
      });
    }
    var _this$props1 = this.props,
      rooms = _this$props1.rooms,
      containerDims = _this$props1.containerDims;
    var isUpstairs = this.state.isUpstairs;
    var sliderCopy = CopyTable.getChapterSliderMessage(this.state.sliderInfo);
    var navButtons = this.renderNavButtons();
    var makeFloor = function makeFloor(upstairs) {
      var floorStr = ChapterPathUtil.getFloorStr(upstairs);
      var roomData = ChapterPathUtil.getRoomsForFloor(rooms, upstairs);
      var _ChapterPathUtil$getR5 = ChapterPathUtil.getRoomPositions(roomData, containerDims.width),
        pathWidth = _ChapterPathUtil$getR5.pathWidth;
      var landscape = _this7.renderBackgroundLandscape(upstairs);
      var roofline = _this7.renderBackgroundRoofline(upstairs);
      var hall = _this7.renderBackgroundHall(upstairs);
      var path = _this7.renderChapterPath(upstairs);
      var containerStyle = {
        width: pathWidth
      };
      return /*#__PURE__*/React.createElement(ScrollArea, {
        key: floorStr + "Scroll",
        preventOuterScroll: true,
        ref: function ref(_ref2) {
          return _this7[floorStr + "Ref"] = getBaseInstance(_ref2);
        },
        contentClassName: styles.scroll,
        areaClassName: isUpstairs === upstairs ? "" : styles.areaHidden,
        hasYScroll: false,
        posStyle: containerStyle,
        contentStyle: containerStyle,
        xBarSize: Math.round(containerDims.width * 0.93),
        noFade: true,
        preservePosRatio: true,
        useGlobalHotkeysForX: true,
        useMouseMoveToScroll: true,
        mainTheme: scrollTheme,
        onKeySpecial: _this7.onSpecialKeys,
        useWonkyCursor: true
      }, landscape, roofline, hall, path);
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, makeFloor(false), makeFloor(true), navButtons, /*#__PURE__*/React.createElement(SliderController, {
      animKey: "slider-path",
      styleType: "headmaster",
      message: this.state.sliderGeneration ? sliderCopy : "",
      generation: this.state.sliderGeneration,
      noSounds: true
    }));
  }
}));

/***/ },

/***/ "./src/trainer/reactView/ChapterPathDottedPath.jsx"
/*!*********************************************************!*\
  !*** ./src/trainer/reactView/ChapterPathDottedPath.jsx ***!
  \*********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var ChapterPathUtil = __webpack_require__(/*! ../../core/util/ChapterPathUtil.js */ "./src/core/util/ChapterPathUtil.js");
var Undraggable = __webpack_require__(/*! ../../core/view/Undraggable.jsx */ "./src/core/view/Undraggable.jsx");
var styles = __webpack_require__(/*! ./styles/ChapterPathDottedPath.css */ "./src/trainer/reactView/styles/ChapterPathDottedPath.css");
module.exports = createReactClass({
  displayName: "ChapterPathDottedPath",
  propTypes: {
    cardinal: PT.string.isRequired,
    containerDims: PT.shape({
      width: PT.number.isRequired
    }).isRequired,
    demo: PT.bool.isRequired,
    gradeNumber: PT.number,
    isLocked: PT.bool.isRequired,
    isUpstairs: PT.bool.isRequired,
    leftStyle: PT.number.isRequired,
    hidePath: PT.bool,
    // skip main path but needs end
    isComplete: PT.bool,
    // required for unlocked tests
    isForStaircase: PT.bool,
    isStart: PT.bool,
    isTest: PT.bool,
    needsEnd: PT.bool,
    roomIsUnlocked: PT.bool,
    useShortPath: PT.bool
  },
  render: function render() {
    var _this$props = this.props,
      cardinal = _this$props.cardinal,
      containerDims = _this$props.containerDims,
      demo = _this$props.demo,
      gradeNumber = _this$props.gradeNumber,
      hidePath = _this$props.hidePath,
      isComplete = _this$props.isComplete,
      isForStaircase = _this$props.isForStaircase,
      isLocked = _this$props.isLocked,
      isStart = _this$props.isStart,
      isTest = _this$props.isTest,
      isUpstairs = _this$props.isUpstairs,
      leftStyle = _this$props.leftStyle,
      needsEnd = _this$props.needsEnd,
      roomIsUnlocked = _this$props.roomIsUnlocked,
      useShortPath = _this$props.useShortPath;
    var widths = ChapterPathUtil.getAdjustedAssetWidths(containerDims.width);
    var filepath = ChapterPathUtil.getDottedPathAsset(isLocked, cardinal, gradeNumber, {
      demo: demo,
      isComplete: isComplete,
      isForStaircase: isForStaircase,
      isStart: isStart,
      isTest: isTest,
      isUpstairs: isUpstairs,
      roomIsUnlocked: roomIsUnlocked,
      useShortPath: useShortPath
    });
    var width = widths.dottedpathSegment;
    var style = {
      left: isStart ? 0 : leftStyle
    };
    var mainClass = styles.main;
    if (isForStaircase) {
      mainClass = styles.mainStairs;
      width = widths.dottedpathStaircase;
    }
    var endPiece;
    if (needsEnd) {
      var endFilepath = ChapterPathUtil.getDottedPathAsset(isLocked, cardinal, gradeNumber, {
        demo: demo,
        isEnd: true,
        isUpstairs: isUpstairs
      });
      endPiece = /*#__PURE__*/React.createElement("img", {
        className: styles.img,
        src: endFilepath,
        style: {
          left: width
        }
      });
    }
    return /*#__PURE__*/React.createElement(Undraggable, null, /*#__PURE__*/React.createElement("div", {
      style: style,
      className: mainClass
    }, /*#__PURE__*/React.createElement("img", {
      className: hidePath ? styles.hidden : styles.img,
      src: filepath
    }), endPiece));
  }
});

/***/ },

/***/ "./src/trainer/reactView/ChapterPathNavigationButton.jsx"
/*!***************************************************************!*\
  !*** ./src/trainer/reactView/ChapterPathNavigationButton.jsx ***!
  \***************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var AssetsUtil = __webpack_require__(/*! ../../core/util/AssetsUtil.js */ "./src/core/util/AssetsUtil.js");
var ChapterPathUtil = __webpack_require__(/*! ../../core/util/ChapterPathUtil.js */ "./src/core/util/ChapterPathUtil.js");
var CopyTable = __webpack_require__(/*! ../../core/util/CopyTable.js */ "./src/core/util/CopyTable.js");
var URLMake = __webpack_require__(/*! ../../../shared/URLMake.js */ "./shared/URLMake.js");
var ChapterPathButton = __webpack_require__(/*! ../../core/view/ChapterPathButton.jsx */ "./src/core/view/ChapterPathButton.jsx");
var CircleButton = __webpack_require__(/*! ../../core/view/CircleButton.jsx */ "./src/core/view/CircleButton.jsx");
var Undraggable = __webpack_require__(/*! ../../core/view/Undraggable.jsx */ "./src/core/view/Undraggable.jsx");
var styles = __webpack_require__(/*! ./styles/ChapterPathNavigationButton.css */ "./src/trainer/reactView/styles/ChapterPathNavigationButton.css");
module.exports = createReactClass({
  displayName: "ChapterPathNavigationButton",
  propTypes: {
    canClick: PT.func.isRequired,
    chapter: PT.object,
    fromChapter: PT.object,
    handleClick: PT.func,
    navType: PT.oneOf(["next", "previous"]).isRequired,
    user: PT.object.isRequired
  },
  createIconElement: function createIconElement() {
    var _this$props = this.props,
      chapter = _this$props.chapter,
      user = _this$props.user,
      navType = _this$props.navType,
      handleClick = _this$props.handleClick,
      canClick = _this$props.canClick;
    var chapterModel = _.get(chapter, "model", null);
    if (!_.isObject(chapterModel)) {
      return null;
    }
    var gradeNumber = chapterModel.gradeNumber,
      chapterIndex = chapterModel.chapterIndex;
    var chapterURL = URLMake.forChapterFromNumbers(gradeNumber, chapterIndex);
    var chapterNumber = chapterIndex + 1;
    // set useGradeNumber to true if new chapter is in a different grade than current one
    var fromGradeNumber = _.get(this.props.fromChapter, "model.gradeNumber", null);
    var useGradeNumber = !(gradeNumber === fromGradeNumber);
    var imageSrc = useGradeNumber ? AssetsUtil.getImageForGrade(gradeNumber, "white") : AssetsUtil.getImageForChapterInGrade(chapterNumber, "white");
    var iconEl = ChapterPathUtil.buildingIsUnlocked(chapterModel) ? /*#__PURE__*/React.createElement("div", {
      className: styles[navType]
    }, /*#__PURE__*/React.createElement(CircleButton, {
      buttonType: "chapterPath",
      clickSound: "lesson-menu",
      linkTo: chapterURL,
      imageSrc: imageSrc,
      imageSize: 4.5,
      handleClick: handleClick,
      canClick: canClick
    })) : /*#__PURE__*/React.createElement(ChapterPathButton, {
      buttonType: "locked",
      isLocked: true,
      canClick: canClick,
      className: styles[navType] + " " + styles.locked,
      lockedText: CopyTable.forChapterLocked(chapter, user, navType),
      tooltipSize: "large"
    });
    return iconEl;
  },
  render: function render() {
    var el = this.createIconElement();
    return /*#__PURE__*/React.createElement(Undraggable, null, el);
  }
});

/***/ },

/***/ "./src/trainer/reactView/ChapterPathRoom.jsx"
/*!***************************************************!*\
  !*** ./src/trainer/reactView/ChapterPathRoom.jsx ***!
  \***************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var AT = __webpack_require__(/*! ../../core/vault/ActionTypes.js */ "./src/core/vault/ActionTypes.js");
var withSetURL = __webpack_require__(/*! ../../core/hoc/withSetURL.jsx */ "./src/core/hoc/withSetURL.jsx");
var withVaultDispatch = __webpack_require__(/*! ../../core/hoc/withVaultDispatch.jsx */ "./src/core/hoc/withVaultDispatch.jsx");
var _require = __webpack_require__(/*! ../../core/util/GlobalFlags.js */ "./src/core/util/GlobalFlags.js"),
  FLAGS = _require.FLAGS;
var AssetsUtil = __webpack_require__(/*! ../../core/util/AssetsUtil.js */ "./src/core/util/AssetsUtil.js");
var ChapterPathUtil = __webpack_require__(/*! ../../core/util/ChapterPathUtil.js */ "./src/core/util/ChapterPathUtil.js");
var CopyTable = __webpack_require__(/*! ../../core/util/CopyTable.js */ "./src/core/util/CopyTable.js");
var GradeChapter = __webpack_require__(/*! ../../../shared/GradeChapter.js */ "./shared/GradeChapter.js");
var OpsBlock = __webpack_require__(/*! ../../core/vault/OpsBlock.js */ "./src/core/vault/OpsBlock.js");
var OpsUser = __webpack_require__(/*! ../../core/vault/OpsUser.js */ "./src/core/vault/OpsUser.js");
var TrainerCore = __webpack_require__(/*! ../../../shared/TrainerCore.js */ "./shared/TrainerCore.js");
var URLMake = __webpack_require__(/*! ../../../shared/URLMake.js */ "./shared/URLMake.js");
var ChapterPathButton = __webpack_require__(/*! ../../core/view/ChapterPathButton.jsx */ "./src/core/view/ChapterPathButton.jsx");
var ChooseOptionModal = __webpack_require__(/*! ../../core/view/ChooseOptionModal.jsx */ "./src/core/view/ChooseOptionModal.jsx");
var Undraggable = __webpack_require__(/*! ../../core/view/Undraggable.jsx */ "./src/core/view/Undraggable.jsx");
var styles = __webpack_require__(/*! ./styles/ChapterPathRoom.css */ "./src/trainer/reactView/styles/ChapterPathRoom.css");

// Helper to apply higher-order components.
var augment = function augment(Component) {
  Component = withSetURL(Component);
  Component = withVaultDispatch(Component);
  return Component;
};
module.exports = augment(createReactClass({
  displayName: "ChapterPathRoom",
  propTypes: {
    blockModel: PT.object.isRequired,
    canClick: PT.func.isRequired,
    chapter: PT.object.isRequired,
    demo: PT.bool.isRequired,
    leftStyle: PT.number.isRequired,
    user: PT.object.isRequired,
    width: PT.number.isRequired,
    cardinal: PT.string,
    // not required if this is a test room
    homeworkData: PT.object,
    isUpstairs: PT.bool,
    // if test room, can assume downstairs
    lessonPromptID: PT.number,
    openBook: PT.func,
    numUnfinishedBlocks: PT.number,
    showLessonPrompt: PT.func,
    skipUnfinishedMessage: PT.bool,
    // TODO: I think this is not used?

    // Injected by HOCs
    setURL: PT.func.isRequired,
    dispatch: PT.func.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      isModalOpen: false,
      hovering: false
    };
  },
  startBlock: function startBlock() {
    var _this$props = this.props,
      demo = _this$props.demo,
      blockModel = _this$props.blockModel;
    var url = demo ? URLMake.forDemo(URLMake.state.forBlock({
      model: blockModel
    })) : URLMake.forBlock({
      model: blockModel
    });
    this.props.setURL(url);
  },
  clickIntoTest: function clickIntoTest() {
    var _this$props2 = this.props,
      blockModel = _this$props2.blockModel,
      user = _this$props2.user;
    if (OpsBlock.isInTestCooldown({
      model: blockModel
    }) && !blockModel.unlocked && !FLAGS.bypassTestCooldown && !OpsUser.hasTeacherRole(user) && blockModel.lockOverride !== "unlocked") {
      this.props.dispatch({
        type: AT.SHOW_MESSAGE,
        messageType: "testCooldown",
        data: {
          expiration: blockModel.testCooldownExpiration,
          reason: blockModel.testCooldownReason,
          user: user,
          modalSize: "large"
        }
      });
    } else if (blockModel.underConstruction) {
      this.props.dispatch({
        type: AT.SHOW_MESSAGE,
        messageType: "blockUnderConstruction"
      });
    } else if (OpsUser.bookTestAssignedNow(user)) {
      this.props.dispatch({
        type: AT.SHOW_MESSAGE,
        messageType: "bookTestScheduled"
      });
    } else {
      var chapterContext = GradeChapter.chapterIDToContext(this.props.chapter.chapterID);
      var dispatchData = {
        onConfirmDispatch: {
          type: AT.START_TEST,
          block: {
            model: blockModel
          }
        },
        baLevel: chapterContext.gradeNumber,
        chapter: chapterContext.chapterIndex + 1,
        chapterName: chapterContext.name
      };
      var messageType = "startTest";
      if (blockModel.hasHistory) {
        messageType = "startRepeatTest";
        dispatchData.onNotConfirmDispatch = {
          type: AT.VIEW_TEST_HISTORY,
          block: {
            model: blockModel
          }
        };
      }
      this.props.dispatch({
        type: AT.SHOW_CONFIRM,
        messageType: messageType,
        data: dispatchData
      });
    }
  },
  showUnfinishedModal: function showUnfinishedModal() {
    var _this$props3 = this.props,
      skipUnfinishedMessage = _this$props3.skipUnfinishedMessage,
      blockModel = _this$props3.blockModel,
      numUnfinishedBlocks = _this$props3.numUnfinishedBlocks;
    return !skipUnfinishedMessage && !blockModel.unfinished && numUnfinishedBlocks >= 3;
  },
  renderTeacher: function renderTeacher() {
    var blockModel = this.props.blockModel;
    var blockStyleType = blockModel.blockStyleType,
      isReading = blockModel.isReading,
      unlocked = blockModel.unlocked,
      gradeNumber = blockModel.gradeNumber;
    if (isReading || TrainerCore.isTestBlock(blockModel)) return null;
    var avatarSrc = AssetsUtil.getBeastAvatar(blockStyleType, gradeNumber, {
      isCircle: unlocked,
      isGray: !unlocked
    });
    return /*#__PURE__*/React.createElement("div", {
      className: styles.teacher + " " + styles["grade" + gradeNumber]
    }, /*#__PURE__*/React.createElement("img", {
      src: avatarSrc,
      className: styles.teacherImg
    }));
  },
  renderTitle: function renderTitle() {
    var _this$props4 = this.props,
      blockModel = _this$props4.blockModel,
      demo = _this$props4.demo,
      cardinal = _this$props4.cardinal;
    var displayName = blockModel.displayName,
      gradeNumber = blockModel.gradeNumber,
      unlocked = blockModel.unlocked;
    var lockedStr = unlocked ? "unlocked" : "locked";
    var titleClasses = [styles.title, styles[lockedStr], styles[demo && !gradeNumber ? "demo" : "grade".concat(gradeNumber)], this.state.hovering ? styles.hoverEffect : ""];
    var title = /*#__PURE__*/React.createElement("div", {
      className: titleClasses.join(" ")
    }, demo && cardinal === "north" && /*#__PURE__*/React.createElement("span", null, "Level ", gradeNumber), /*#__PURE__*/React.createElement("p", null, displayName), demo && cardinal === "south" && /*#__PURE__*/React.createElement("span", null, "Level ", gradeNumber));
    return title;
  },
  renderModal: function renderModal() {
    var _this = this;
    var _this$props5 = this.props,
      blockModel = _this$props5.blockModel,
      demo = _this$props5.demo;
    var isModalOpen = this.state.isModalOpen;
    var handleModalClose = function handleModalClose() {
      return _this.setState({
        isModalOpen: false
      });
    };
    var isDemoTest = TrainerCore.isTestBlock(blockModel) && demo;
    if (isModalOpen) {
      var handleStartBlock = isDemoTest ? function () {
        _this.props.setURL(URLMake.forEnroll());
      } : function () {
        //First close the modal
        handleModalClose();
        //Then start the block
        _this.startBlock();
      };
      return /*#__PURE__*/React.createElement(ChooseOptionModal, {
        buttonTexts: ["signmeup", "cancel"],
        buttonClickHandlers: [handleStartBlock, handleModalClose],
        onClose: handleModalClose
      }, isDemoTest ? CopyTable.forDemoTestModal() : CopyTable.forUnfinishedBlocks(this.props.numUnfinishedBlocks));
    }
    return null;
  },
  /**
   * Creates an invisible box to trigger a hover effect over the visible room
   * part of the image.
   */
  renderHoverBox: function renderHoverBox() {
    var _this2 = this;
    var _this$props6 = this.props,
      blockModel = _this$props6.blockModel,
      cardinal = _this$props6.cardinal,
      leftStyle = _this$props6.leftStyle,
      width = _this$props6.width;
    var isTest = TrainerCore.isTestBlock(blockModel);
    var isReading = blockModel.isReading;
    var widthProportion, marginProportion, boxWidth, boxHeight, type;
    if (isTest) {
      widthProportion = 1 / 3; // one-third of the full asset width is the room
      marginProportion = (1 - widthProportion) / 2 + 0.02; // room is roughly centered in asset
      boxWidth = width * widthProportion;
      boxHeight = boxWidth * 2;
      type = "test";
    } else {
      widthProportion = 0.69; // ~69% of the full asset width is the room
      marginProportion = (1 - widthProportion) / 2; // room is centered in asset
      boxWidth = width * widthProportion;
      if (isReading) {
        boxHeight = boxWidth * 0.6;
        type = cardinal + "Reading";
      } else {
        boxHeight = boxWidth;
        type = cardinal + "Lesson";
      }
    }
    var leftMargin = width * marginProportion;
    var classes = [styles.hoverBox, styles[type]];
    var style = {
      width: boxWidth,
      height: boxHeight,
      left: leftStyle + leftMargin
    };
    var clickHandler = function clickHandler() {
      // imitate click on button
      _this2.buttonRef.click();
    };
    return /*#__PURE__*/React.createElement("div", {
      className: classes.join(" "),
      style: style,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onClick: clickHandler
    });
  },
  getButtonProps: function getButtonProps() {
    var _this3 = this;
    var _this$props7 = this.props,
      blockModel = _this$props7.blockModel,
      chapter = _this$props7.chapter,
      user = _this$props7.user,
      openBook = _this$props7.openBook,
      isUpstairs = _this$props7.isUpstairs,
      demo = _this$props7.demo,
      canClick = _this$props7.canClick;
    var isReading = blockModel.isReading;
    var isTest = TrainerCore.isTestBlock(blockModel);
    var isLocked = !blockModel.unlocked;
    var lockedText = CopyTable.forBlockLocked({
      model: blockModel
    }, chapter, user, null, demo);
    var lockedTooltipText = CopyTable.forBlockLocked({
      model: blockModel
    }, chapter, user, true, demo);
    var buttonType = "coreLesson";
    var tooltipSize = "";
    if (isUpstairs) buttonType = "enrichmentLesson";
    if (isReading) buttonType = "reading";
    if (isTest) buttonType = "test";
    if (isLocked) tooltipSize = "large";
    var trophyURL = "";
    if (blockModel.isTrophyAvailable) {
      trophyURL = URLMake.forTrophyProblem({
        model: blockModel
      });
    }
    var linkTo = URLMake.forBlock({
      model: blockModel
    });
    var onClick = null;
    if (isReading) {
      onClick = function onClick() {
        return openBook(blockModel.bookSectionID);
      };
      linkTo = null;
    } else if (isTest) {
      if (demo) {
        onClick = function onClick() {
          _this3.setState({
            isModalOpen: true
          });
          _this3.props.dispatch({
            type: AT.UPDATE_CHAPTER_PATH_AVATAR,
            context: {
              navAction: "enter-block",
              isTest: true // demo test doesn't have a block ID
            }
          });
        };
      } else {
        var allowUnfinishedTest = OpsUser.hasKey(user, "trainer allow unfinished test") || OpsUser.hasTeacherRole(user);
        if (!allowUnfinishedTest) {
          linkTo = null;
          onClick = this.clickIntoTest;
        }
      }
    } else if (this.showUnfinishedModal()) {
      onClick = function onClick() {
        return _this3.setState({
          isModalOpen: true
        });
      };
    }
    var handleClick = function handleClick() {
      canClick() && onClick && onClick();
    };
    return {
      linkTo: linkTo,
      handleClick: handleClick,
      canClick: canClick,
      trophyURL: trophyURL,
      buttonType: buttonType,
      tooltipSize: tooltipSize,
      lockedText: lockedText,
      lockedTooltipText: lockedTooltipText
    };
  },
  onMouseEnter: function onMouseEnter() {
    var blockModel = this.props.blockModel;
    if (blockModel.unlocked) {
      if (!this.state.hovering) {
        this.setState({
          hovering: true
        });
      }
    }
  },
  onMouseLeave: function onMouseLeave() {
    var blockModel = this.props.blockModel;
    if (blockModel.unlocked) {
      if (this.state.hovering) {
        this.setState({
          hovering: false
        });
      }
    }
  },
  render: function render() {
    var _this4 = this;
    var _this$props8 = this.props,
      blockModel = _this$props8.blockModel,
      cardinal = _this$props8.cardinal,
      demo = _this$props8.demo,
      homeworkData = _this$props8.homeworkData,
      isUpstairs = _this$props8.isUpstairs,
      leftStyle = _this$props8.leftStyle,
      lessonPromptID = _this$props8.lessonPromptID,
      showLessonPrompt = _this$props8.showLessonPrompt,
      width = _this$props8.width;
    var isComplete = ChapterPathUtil.blockIsComplete(blockModel);
    var isLocked = !(blockModel.unlocked || FLAGS.accessLockedBlocks);
    var isReading = blockModel.isReading;
    var isTest = TrainerCore.isTestBlock(blockModel);
    var filepath = ChapterPathUtil.getRoomAsset(isLocked, blockModel.gradeNumber, {
      cardinal: cardinal,
      demo: blockModel.gradeNumber ? false : demo,
      isComplete: isComplete,
      isReading: isReading,
      isTest: isTest,
      isUpstairs: isUpstairs,
      styleType: blockModel.blockStyleType
    });
    var additionalClass = lessonPromptID && blockModel.blockID === lessonPromptID ? styles.higher : "";
    var buttonProps = this.getButtonProps();
    var style = {
      left: leftStyle,
      width: width
    };
    var type = isTest ? "test" : cardinal;
    // Button needs to be a sibling instead of a child for z-index to be over path
    return /*#__PURE__*/React.createElement(Undraggable, null, /*#__PURE__*/React.createElement("div", {
      className: styles.main + " " + styles[type],
      style: style
    }, /*#__PURE__*/React.createElement("img", {
      className: styles.room,
      src: filepath
    }), this.renderTeacher(), this.renderTitle(), this.renderModal()), this.renderHoverBox(), /*#__PURE__*/React.createElement("div", {
      className: styles.mainButton + " " + additionalClass,
      style: style
    }, /*#__PURE__*/React.createElement(ChapterPathButton, {
      ref: function ref(button) {
        return _this4.buttonRef = button;
      },
      buttonType: buttonProps.buttonType,
      isUpstairs: !!isUpstairs,
      isLocked: isLocked,
      blockID: blockModel.blockID,
      canClick: buttonProps.canClick,
      cardinal: isTest ? null : cardinal,
      forceHover: this.state.hovering,
      handleClick: buttonProps.handleClick,
      homeworkData: homeworkData,
      isComplete: blockModel.isComplete,
      isTrophyAvailable: blockModel.isTrophyAvailable,
      isTrophyComplete: blockModel.isTrophyComplete,
      lessonPromptID: lessonPromptID,
      linkTo: buttonProps.linkTo,
      lockedText: buttonProps.lockedText,
      lockedTooltipText: buttonProps.lockedTooltipText,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      percentComplete: blockModel.percentComplete,
      showLessonPrompt: showLessonPrompt,
      stars: blockModel.starsObtained,
      tooltipSize: buttonProps.tooltipSize,
      trophyURL: buttonProps.trophyURL
    })));
  }
}));

/***/ },

/***/ "./src/trainer/reactView/ChapterPathStaircase.jsx"
/*!********************************************************!*\
  !*** ./src/trainer/reactView/ChapterPathStaircase.jsx ***!
  \********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var ChapterPathUtil = __webpack_require__(/*! ../../core/util/ChapterPathUtil.js */ "./src/core/util/ChapterPathUtil.js");
var CopyTable = __webpack_require__(/*! ../../core/util/CopyTable.js */ "./src/core/util/CopyTable.js");
var _require = __webpack_require__(/*! ../../../shared/TrainerCore.js */ "./shared/TrainerCore.js"),
  MIN_STARS_PER_BLOCK_FOR_ENRICHMENT = _require.MIN_STARS_PER_BLOCK_FOR_ENRICHMENT;
var ChapterPathButton = __webpack_require__(/*! ../../core/view/ChapterPathButton.jsx */ "./src/core/view/ChapterPathButton.jsx");
var Undraggable = __webpack_require__(/*! ../../core/view/Undraggable.jsx */ "./src/core/view/Undraggable.jsx");
var styles = __webpack_require__(/*! ./styles/ChapterPathStaircase.css */ "./src/trainer/reactView/styles/ChapterPathStaircase.css");
module.exports = createReactClass({
  displayName: "ChapterPathStaircase",
  propTypes: {
    downstairsBlockModels: PT.array.isRequired,
    upstairsBlockModels: PT.array.isRequired,
    canClick: PT.func.isRequired,
    cardinal: PT.string.isRequired,
    gradeNumber: PT.number,
    isUpstairs: PT.bool.isRequired,
    leftStyle: PT.number.isRequired,
    stairIndex: PT.number.isRequired,
    takeStairs: PT.func.isRequired,
    width: PT.number.isRequired,
    homeworkData: PT.array
  },
  getButtonProps: function getButtonProps() {
    var _this$props = this.props,
      takeStairs = _this$props.takeStairs,
      stairIndex = _this$props.stairIndex,
      canClick = _this$props.canClick;
    var handleClick = function handleClick() {
      canClick() && takeStairs(stairIndex);
    };
    return {
      handleClick: handleClick
    };
  },
  render: function render() {
    var _this$props2 = this.props,
      downstairsBlockModels = _this$props2.downstairsBlockModels,
      upstairsBlockModels = _this$props2.upstairsBlockModels,
      canClick = _this$props2.canClick,
      cardinal = _this$props2.cardinal,
      gradeNumber = _this$props2.gradeNumber,
      isUpstairs = _this$props2.isUpstairs,
      leftStyle = _this$props2.leftStyle,
      width = _this$props2.width,
      homeworkData = _this$props2.homeworkData;
    var percentComplete = 0;
    if (!isUpstairs) {
      var numBlocksCompleted = upstairsBlockModels.filter(function (room) {
        return ChapterPathUtil.roomIsComplete(room);
      }).length;
      percentComplete = numBlocksCompleted / upstairsBlockModels.length;
    }
    var isLocked = !ChapterPathUtil.staircaseIsUnlocked(upstairsBlockModels);
    var lockedStr = isLocked ? "locked" : "unlocked";
    var filepath = ChapterPathUtil.getStaircaseAsset(lockedStr, cardinal, isUpstairs, gradeNumber);
    var style = {
      left: leftStyle,
      width: width
    };
    var passed = downstairsBlockModels.filter(function (b) {
      return !b.isReading && b.starsObtained >= MIN_STARS_PER_BLOCK_FOR_ENRICHMENT;
    }).length;
    var total = downstairsBlockModels.filter(function (b) {
      return !b.isReading;
    }).length;
    var lockedText = CopyTable.forStairLocked(isUpstairs);
    var _this$getButtonProps = this.getButtonProps(),
      handleClick = _this$getButtonProps.handleClick;
    return /*#__PURE__*/React.createElement(Undraggable, null, /*#__PURE__*/React.createElement("div", {
      style: style,
      className: styles.main
    }, /*#__PURE__*/React.createElement("img", {
      className: styles.img,
      src: filepath
    })), /*#__PURE__*/React.createElement("div", {
      style: style,
      className: styles.mainButton
    }, /*#__PURE__*/React.createElement(ChapterPathButton, {
      buttonType: isUpstairs ? "stairsDown" : "stairsUp",
      isUpstairs: isUpstairs,
      isLocked: isLocked,
      canClick: canClick,
      cardinal: cardinal,
      handleClick: handleClick,
      homeworkData: homeworkData,
      isComplete: percentComplete === 1,
      lockedText: lockedText,
      percentComplete: percentComplete,
      stairProgress: [passed, total],
      tooltipSize: isLocked ? "large" : "medium",
      tooltipText: !isUpstairs && !isLocked ? "Enrichment Lessons" : ""
    })));
  }
});

/***/ },

/***/ "./src/trainer/reactView/DevProblemList.jsx"
/*!**************************************************!*\
  !*** ./src/trainer/reactView/DevProblemList.jsx ***!
  \**************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var URLMake = __webpack_require__(/*! ../../../shared/URLMake.js */ "./shared/URLMake.js");
var _require = __webpack_require__(/*! ../../core/util/Storage.js */ "./src/core/util/Storage.js"),
  getStorage = _require.getStorage;
var Link = __webpack_require__(/*! ../../core/view/Link.jsx */ "./src/core/view/Link.jsx");
var OpsDevProblem = __webpack_require__(/*! ../vault/OpsDevProblem.js */ "./src/trainer/vault/OpsDevProblem.js");
var devProblemData = __webpack_require__(/*! ../devProblemData.js */ "./src/trainer/devProblemData.js");
var _require2 = __webpack_require__(/*! ../../../shared/data/engines.json */ "./shared/data/engines.json"),
  engineIDs = _require2.engineIDs;
var styles = __webpack_require__(/*! ../../core/view/styles/DevPanels.css */ "./src/core/view/styles/DevPanels.css");
module.exports = createReactClass({
  displayName: "DevProblemList",
  getInitialState: function getInitialState() {
    return {
      isExpanded: false,
      enableSave: OpsDevProblem.getSavingEnabled(getStorage())
    };
  },
  onSaveChange: function onSaveChange(evt) {
    var newValue = !!evt.target.checked;
    OpsDevProblem.setSavingEnabled(newValue, getStorage());
    this.setState({
      enableSave: newValue
    });
  },
  render: function render() {
    var _this = this;
    var isExpanded = this.state.isExpanded;
    var onToggle = function onToggle() {
      return _this.setState({
        isExpanded: !isExpanded
      });
    };
    var expandClass = isExpanded ? styles.expandYes : styles.expandNo;
    var baseEl = /*#__PURE__*/React.createElement("div", {
      className: expandClass,
      onClick: onToggle
    }, "Dev Problems ", /*#__PURE__*/React.createElement("div", {
      className: styles.expandIcon
    }));
    if (!isExpanded) {
      return baseEl;
    }

    // TODO: devProblemData hard-coded, instead of being a prop, but bundle
    // splitting concerns make that hard to fix. Maybe can take advantage of
    // this view only needing the list of keys?

    var devProblemDataGrouped = _.groupBy(_.map(devProblemData, function (problem, name) {
      return {
        name: name,
        engine: _.findKey(engineIDs, function (id) {
          return id === (problem.interactiveRendererID || problem.rendererID);
        })
      };
    }), "engine");
    var devProblemDataOrganized = _.map(Object.keys(devProblemDataGrouped).sort(), function (key) {
      return {
        engine: devProblemDataGrouped[key][0].engine,
        problems: _.map(devProblemDataGrouped[key], "name")
      };
    });
    var organizedElements = devProblemDataOrganized.map(function (_ref) {
      var problems = _ref.problems,
        engine = _ref.engine;
      return /*#__PURE__*/React.createElement("details", {
        key: engine,
        open: problems.some(function (prob) {
          return window.location.pathname === URLMake.forDevProblem(prob);
        })
      }, /*#__PURE__*/React.createElement("summary", {
        style: {
          cursor: "pointer",
          padding: "0.1em"
        }
      }, engine, " (", problems.length, ")"), /*#__PURE__*/React.createElement("div", {
        style: {
          paddingLeft: "2em"
        }
      }, problems.map(function (prob) {
        return /*#__PURE__*/React.createElement("div", {
          key: prob
        }, /*#__PURE__*/React.createElement(Link, {
          to: URLMake.forDevProblem(prob),
          className: styles.link
        }, prob));
      })));
    });
    var saveCheckProps = {
      type: "checkbox",
      checked: this.state.enableSave,
      onChange: this.onSaveChange
    };
    return /*#__PURE__*/React.createElement("div", {
      className: styles.expandContainer
    }, baseEl, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", saveCheckProps), " Save state locally"), /*#__PURE__*/React.createElement("div", {
      className: styles.problems,
      ref: function ref(el) {
        if (!el || !el.querySelector("details[open]")) {
          return;
        }
        el.scrollTop = el.querySelector("details[open]").offsetTop - el.offsetTop - 30;
      }
    }, organizedElements));
  }
});

/***/ },

/***/ "./src/trainer/reactView/DevProblemView.jsx"
/*!**************************************************!*\
  !*** ./src/trainer/reactView/DevProblemView.jsx ***!
  \**************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var TrainerPageWrapper = __webpack_require__(/*! ./TrainerPageWrapper.jsx */ "./src/trainer/reactView/TrainerPageWrapper.jsx");
var Engine = __webpack_require__(/*! ./Engine.jsx */ "./src/trainer/reactView/Engine.jsx");
var DevReportProblemView = __webpack_require__(/*! ./DevReportProblemView.jsx */ "./src/trainer/reactView/DevReportProblemView.jsx");
var problemViewStyles = __webpack_require__(/*! ./styles/DevReportProblemView.css */ "./src/trainer/reactView/styles/DevReportProblemView.css");
var PropTypes = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var getInstructionsViewData = function getInstructionsViewData(result, devProblemName) {
  var embeddedProblemID = 77777; // this is an arbitrary number, but can't be 0
  var instructionsBase = {
    instructionID: 0,
    type: "block-start",
    problemIndex: -1,
    style: "fiona",
    problemIDs: [embeddedProblemID],
    text: "\n      These are instructions for the devProblem \"".concat(devProblemName, "\".\n\n      \\begin{exampleBlock}Make sure the example below is well-proportioned.\\end{exampleBlock}\n\n      \\begin{example} \\pid{").concat(embeddedProblemID, "} \\interactive{true} \\checkable{true} \\end{example}\n\n      Is it good?\n\n      \\bold{NOTE:} The behavior here may be more finnicky than in a real scenario, so this is more useful for proportions than for behavior tests.\n    ").trim()
  };
  var problemModel = result.problems[0].model;
  problemModel.problemID = embeddedProblemID;
  problemModel.baeditorID = embeddedProblemID;
  problemModel.instructions = instructionsBase;
  return {
    bookSectionID: null,
    instructionsBase: instructionsBase,
    instructionsText: instructionsBase.text,
    instructionsToolType: null,
    problems: _defineProperty({}, embeddedProblemID, problemModel)
  };
};
var DevProblemView = function DevProblemView(_ref) {
  var result = _ref.result,
    blockInfo = _ref.blockInfo,
    _ref$isIdle = _ref.isIdle,
    isIdle = _ref$isIdle === void 0 ? false : _ref$isIdle,
    _ref$reactCrashed = _ref.reactCrashed,
    reactCrashed = _ref$reactCrashed === void 0 ? false : _ref$reactCrashed,
    _ref$devProblemName = _ref.devProblemName,
    devProblemName = _ref$devProblemName === void 0 ? "Test Problem" : _ref$devProblemName,
    showInstructions = _ref.showInstructions,
    user = _ref.user;
  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    reportViewOpen = _React$useState2[0],
    setReportViewOpen = _React$useState2[1];
  var problem = result.problems[0];

  // TODO refactor hardcoded stuff shared by PageDevProblem
  var blockModel = {
    displayName: blockInfo.blockName,
    blockID: null,
    chapterID: 6,
    gradeNumber: 3,
    chapterIndex: 5,
    blockType: blockInfo.blockType,
    blockIndex: -1,
    blockStyleType: blockInfo.blockStyleType,
    starCutoffs: [7, 5, 3],
    starsAvailable: 3,
    starsObtained: 0
  };
  var userModel = {
    avatar: {},
    displayName: "Tester",
    bucks: 9000,
    xp: 50
  };
  var wrapperProps = {
    gradeNumber: 3,
    chapterIndex: 5,
    blockIndex: 0,
    blockType: "character",
    problemIndex: 0,
    user: {
      model: userModel,
      load: "done"
    },
    block: {
      model: blockModel,
      load: "done"
    },
    result: result
  };
  var reportViewButton = /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return setReportViewOpen(true);
    },
    className: problemViewStyles.reportViewButton
  }, "Report View");
  var engine = /*#__PURE__*/React.createElement(Engine, {
    result: result,
    problem: problem,
    problemIndex: 0,
    instructionsViewData: getInstructionsViewData(result, devProblemName),
    showInstructions: showInstructions,
    isIdle: isIdle,
    connected: true,
    isDev: true,
    user: user
  });
  var reportView = reportViewOpen ? /*#__PURE__*/React.createElement(DevReportProblemView, {
    result: result,
    problem: problem,
    onClose: function onClose() {
      return setReportViewOpen(false);
    }
  }) : null;
  if (reactCrashed) {
    engine = null;
    reportView = null;
    reportViewButton = null;
  }
  return /*#__PURE__*/React.createElement(TrainerPageWrapper, wrapperProps, engine, reportView, reportViewButton);
};
DevProblemView.propTypes = {
  result: PropTypes.object.isRequired,
  blockInfo: PropTypes.object.isRequired,
  isIdle: PropTypes.bool,
  reactCrashed: PropTypes.bool,
  devProblemName: PropTypes.string,
  showInstructions: PropTypes.bool,
  user: PropTypes.object
};
module.exports = DevProblemView;

/***/ },

/***/ "./src/trainer/reactView/DevReportProblemView.jsx"
/*!********************************************************!*\
  !*** ./src/trainer/reactView/DevReportProblemView.jsx ***!
  \********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var withContainerDims = __webpack_require__(/*! ../../core/hoc/withContainerDims.jsx */ "./src/core/hoc/withContainerDims.jsx");
var EngineUtil = __webpack_require__(/*! ../../trainer/EngineCreator.js */ "./src/trainer/EngineCreator.js");
var ResultBanvas = __webpack_require__(/*! ../util/LegacyResultBanvas.js */ "./src/trainer/util/LegacyResultBanvas.js");
var BanvasView = __webpack_require__(/*! ../../trainer/reactView/Banvas.jsx */ "./src/trainer/reactView/Banvas.jsx");
var Modal = __webpack_require__(/*! ../../core/view/Modal.jsx */ "./src/core/view/Modal.jsx");
var ModalClose = __webpack_require__(/*! ../../core/view/ModalClose.jsx */ "./src/core/view/ModalClose.jsx");
var styles = __webpack_require__(/*! ./styles/DevReportProblemView.css */ "./src/trainer/reactView/styles/DevReportProblemView.css");

// Helper to apply higher-order components.
var augment = function augment(Component) {
  Component = withContainerDims(Component);
  return Component;
};
module.exports = augment(createReactClass({
  displayName: "ReportProblemView",
  propTypes: {
    result: PT.object.isRequired,
    problem: PT.object.isRequired,
    onClose: PT.func.isRequired,
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
  componentDidMount: function componentDidMount() {
    this.reLayout();
  },
  componentDidUpdate: function componentDidUpdate() {
    this.reLayout();
  },
  reLayout: function reLayout() {
    // Note: layout is expensive and there might be a better way to do this to
    // make sure all the views fit in their measured rects.
    this.problemBanvas && this.problemBanvas.doFullLayout();
    this.solutionBanvas && this.solutionBanvas.doFullLayout();
    this.trialBanvas && this.trialBanvas.doFullLayout();
  },
  render: function render() {
    var _this$props = this.props,
      result = _this$props.result,
      problem = _this$props.problem,
      containerDims = _this$props.containerDims;
    var problemModel = problem.model;

    // Processor initialization
    EngineUtil.initializeModel(problemModel);
    var customDims = {
      // Not exactly the same dimensions as parent report view but
      // should generally give a good feel for how large it will be
      width: Math.min(900, containerDims.windowWidth * 0.67),
      height: 675,
      // Should be 4:3 width:height ratio
      left: 0,
      top: 0,
      windowWidth: containerDims.windowWidth,
      windowHeight: containerDims.windowHeight
    };

    // Problem and solution view
    var problemBanvas = ResultBanvas.forShowProblem(result, problem, {
      forModal: false,
      containerDims: customDims,
      forReport: true
    });
    var problemSize = problemBanvas.getMainView().measure(customDims.width);
    this.problemBanvas = problemBanvas;
    var engineSettings = EngineUtil.getEngineSettings(problemModel.rendererID);
    var resultIsGame = engineSettings.neverShowSolution && !problemModel.solutionText;
    var solutionBanvas = resultIsGame ? null : ResultBanvas.forSolution(result, problem, {
      containerDims: customDims
    });
    this.solutionBanvas = solutionBanvas;
    var solutionEl;
    if (solutionBanvas) {
      var solutionSize = solutionBanvas.getMainView().measure(customDims.width);
      solutionEl = /*#__PURE__*/React.createElement(BanvasView, {
        width: customDims.width,
        height: solutionSize.h,
        canvasType: "solution",
        premadeBanvas: solutionBanvas,
        isInteractive: false,
        resizeBasedOnGivenDims: true
      });
    } else if (engineSettings.neverShowSolution) {
      solutionEl = /*#__PURE__*/React.createElement("div", {
        className: styles.noSolution
      }, "No solution available for this problem.");
    }
    var solutionTitle = solutionEl ? /*#__PURE__*/React.createElement("div", {
      className: styles.sectionTitle
    }, "Solution") : null;
    return /*#__PURE__*/React.createElement("div", {
      className: styles.problemsBackdropWrapper
    }, /*#__PURE__*/React.createElement(Modal, {
      onClose: this.props.onClose,
      closeClass: styles.modalClose,
      modalClass: styles.problemsModal,
      backdropClass: styles.problemsBackdrop,
      closeOnEsc: true,
      portalContainer: null,
      level: "aboveAll",
      closeOnBackdropClick: true,
      isScrollable: true,
      isFixed: true
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.main
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.sectionTitle
    }, "Problem"), /*#__PURE__*/React.createElement("div", {
      className: styles.banvasWrapper
    }, /*#__PURE__*/React.createElement(BanvasView, {
      width: customDims.width,
      height: problemSize.h,
      canvasType: "solution",
      premadeBanvas: problemBanvas,
      isInteractive: false,
      resizeBasedOnGivenDims: true
    })), solutionTitle, /*#__PURE__*/React.createElement("div", {
      className: styles.banvasWrapper
    }, solutionEl)), /*#__PURE__*/React.createElement(ModalClose, {
      extraClassName: styles.modalClose,
      onClick: this.props.onClose
    })));
  }
}));

/***/ },

/***/ "./src/trainer/reactView/OverviewTest.jsx"
/*!************************************************!*\
  !*** ./src/trainer/reactView/OverviewTest.jsx ***!
  \************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var _require = __webpack_require__(/*! ../../core/view/Portal.tsx */ "./src/core/view/Portal.tsx"),
  Portal = _require.Portal;
var _require2 = __webpack_require__(/*! ../../../shared/PortalConstants.ts */ "./shared/PortalConstants.ts"),
  PORTAL_CONTAINERS = _require2.PORTAL_CONTAINERS;
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var AT = __webpack_require__(/*! ../../core/vault/ActionTypes.js */ "./src/core/vault/ActionTypes.js");
var BlueButton = __webpack_require__(/*! ../../core/view/BlueButton.jsx */ "./src/core/view/BlueButton.jsx");
var TrainerCopyTable = __webpack_require__(/*! ../../core/util/TrainerCopyTable.jsx */ "./src/core/util/TrainerCopyTable.jsx");
var MessageBubble = __webpack_require__(/*! ../../core/view/MessageBubble.jsx */ "./src/core/view/MessageBubble.jsx");
var ReadAloudButton = __webpack_require__(/*! ./ReadAloudButton.jsx */ "./src/trainer/reactView/ReadAloudButton.jsx");
var ChooseOptionModal = __webpack_require__(/*! ../../core/view/ChooseOptionModal.jsx */ "./src/core/view/ChooseOptionModal.jsx");
var ConfirmTestModal = __webpack_require__(/*! ../../core/view/ConfirmTestModal.jsx */ "./src/core/view/ConfirmTestModal.jsx");
var URLMake = __webpack_require__(/*! ../../../shared/URLMake.js */ "./shared/URLMake.js");
var AssetsUtil = __webpack_require__(/*! ../../core/util/AssetsUtil.js */ "./src/core/util/AssetsUtil.js");
var TrainerCore = __webpack_require__(/*! ../../../shared/TrainerCore.js */ "./shared/TrainerCore.js");
var BlockStyle = __webpack_require__(/*! ../../core/vault/BlockStyle.js */ "./src/core/vault/BlockStyle.js");
var OpsUser = __webpack_require__(/*! ../../core/vault/OpsUser.js */ "./src/core/vault/OpsUser.js");
var OpsResult = __webpack_require__(/*! ../vault/OpsResult.js */ "./src/trainer/vault/OpsResult.js");
var SetProgressButton = __webpack_require__(/*! ../../core/view/SetProgressButton.jsx */ "./src/core/view/SetProgressButton.jsx");
var withVaultDispatch = __webpack_require__(/*! ../../core/hoc/withVaultDispatch.jsx */ "./src/core/hoc/withVaultDispatch.jsx");
var withContainerDims = __webpack_require__(/*! ../../core/hoc/withContainerDims.jsx */ "./src/core/hoc/withContainerDims.jsx");
var withSetURL = __webpack_require__(/*! ../../core/hoc/withSetURL.jsx */ "./src/core/hoc/withSetURL.jsx");
var SliderController = __webpack_require__(/*! ../../core/view/SliderController.jsx */ "./src/core/view/SliderController.jsx");
var Tray = __webpack_require__(/*! ../../core/view/ToolTray.jsx */ "./src/core/view/ToolTray.jsx");
var Sounds = __webpack_require__(/*! ../../core/util/Sounds.js */ "./src/core/util/Sounds.js");
var _require3 = __webpack_require__(/*! ../../core/util/GlobalFlags.js */ "./src/core/util/GlobalFlags.js"),
  FLAGS = _require3.FLAGS;
var ShowInstructionsView = __webpack_require__(/*! ./ShowInstructions.jsx */ "./src/trainer/reactView/ShowInstructions.jsx");
var styles = __webpack_require__(/*! ./styles/OverviewTest.css */ "./src/trainer/reactView/styles/OverviewTest.css");

// Helper to apply higher-order components.
var augment = function augment(Component) {
  Component = withSetURL(Component);
  Component = withVaultDispatch(Component);
  Component = withContainerDims(Component);
  return Component;
};
module.exports = augment(createReactClass({
  displayName: "OverviewTestView",
  propTypes: {
    result: PT.object.isRequired,
    user: PT.object.isRequired,
    gradeNumber: PT.number,
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
    setURL: PT.func.isRequired,
    instructionsViewData: PT.object,
    showInstructions: PT.bool
  },
  getInitialState: function getInitialState() {
    return {
      isSubmitModalOpen: false,
      isQuitModalOpen: false,
      isSkipPart2ModalOpen: false,
      instructionsWillClose: false,
      sliderMessage: "",
      sliderGeneration: 0,
      sliderSpecialType: null,
      progressProps: TrainerCore.getProgressProps(this.props.result.problems, this.props.result.hasIntervened)
    };
  },
  UNSAFE_componentWillReceiveProps: function UNSAFE_componentWillReceiveProps(newProps) {
    var newState = {};
    if (this.props.showInstructions !== newProps.showInstructions) {
      if (newProps.showInstructions) {
        newState = {
          instructionsWillClose: false
        };
      } else {
        newState = {
          instructionsWillClose: true
        };
      }
    }
    this.setState(newState);
  },
  setSliderMessage: function setSliderMessage(message) {
    var sliderSpecialType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    this.setState({
      sliderMessage: message || "",
      sliderGeneration: this.state.sliderGeneration + 1,
      sliderSpecialType: sliderSpecialType
    });
  },
  clickSubmitTestPart: function clickSubmitTestPart(testInfo) {
    var submitCheck = TrainerCore.checkTestSubmitRestrictions(testInfo, {
      ignoreTime: FLAGS.ignoreBookTestTimeRestriction
    });
    if (!submitCheck.canSubmit) {
      this.setSliderMessage(TrainerCopyTable.forTestOverview(submitCheck.error, testInfo));
      Sounds.playSound("headmaster-incomplete");
    } else {
      this.setSliderMessage();
      Sounds.playSound("headmaster-cyw-2");
      this.setState({
        isSubmitModalOpen: true
      });
    }
  },
  renderProblemOverviewNavButtons: function renderProblemOverviewNavButtons(testInfo) {
    var _this = this;
    var result = this.props.result;
    var part = testInfo.part;
    var handleCheckClick = function handleCheckClick() {
      _this.props.dispatch({
        type: AT.GOTO_FIRST_PROBLEM
      });
    };
    var handleQuitClick = function handleQuitClick() {
      _this.setState({
        isQuitModalOpen: true
      });
    };
    var submitButtonText = "submitpart" + part + (result.resultType === "bookTest" ? "small" : "");
    var checkButton = /*#__PURE__*/React.createElement(BlueButton, {
      handleClick: handleCheckClick,
      buttonType: "testdoublecheck"
    });
    var quitButton = /*#__PURE__*/React.createElement(BlueButton, {
      handleClick: handleQuitClick,
      buttonType: "quittest",
      variant: "secondary",
      isSmall: true
    });
    var submitButton = /*#__PURE__*/React.createElement(BlueButton, {
      handleClick: function handleClick() {
        return _this.clickSubmitTestPart(testInfo);
      },
      buttonType: submitButtonText
    });
    var fillDiv = /*#__PURE__*/React.createElement("div", {
      className: styles.fill
    });
    var leftButton = part === 1 ? quitButton : fillDiv;
    var centerButton = submitButton;
    if (result.resultType === "bookTest") {
      leftButton = submitButton;
      centerButton = checkButton;
    }
    return /*#__PURE__*/React.createElement("div", {
      className: styles.navButtons
    }, leftButton, centerButton, fillDiv);
  },
  renderPart1DecisionNavButtons: function renderPart1DecisionNavButtons() {
    var _this2 = this;
    var result = this.props.result;
    var skipPart2Button = result.resultType === "bookTest" ? /*#__PURE__*/React.createElement("div", {
      className: styles.fill
    }) : /*#__PURE__*/React.createElement(BlueButton, {
      handleClick: function handleClick() {
        return _this2.setState({
          isSkipPart2ModalOpen: true
        });
      },
      buttonType: "medium-size",
      buttonText: "stop test",
      variant: "secondary",
      isSmall: true
    });
    return /*#__PURE__*/React.createElement("div", {
      className: styles.navButtons
    }, skipPart2Button, /*#__PURE__*/React.createElement(BlueButton, {
      handleClick: this.startPart2,
      buttonType: "medium-size",
      buttonText: "start part 2"
    }), /*#__PURE__*/React.createElement("div", {
      className: styles.fill
    }));
  },
  renderQuitTestNavButtons: function renderQuitTestNavButtons() {
    var _this3 = this;
    var handleCheckClick = function handleCheckClick() {
      _this3.setState({
        isQuitModalOpen: false
      });
      _this3.props.dispatch({
        type: AT.GOTO_FIRST_PROBLEM
      });
    };
    return /*#__PURE__*/React.createElement("div", {
      className: styles.quitTestNavButtons
    }, /*#__PURE__*/React.createElement(BlueButton, {
      buttonType: "quittest",
      handleClick: this.quitTest,
      variant: "secondary",
      isSmall: true
    }), /*#__PURE__*/React.createElement(BlueButton, {
      buttonType: "keepworking",
      handleClick: handleCheckClick
    }));
  },
  renderSkipPart2NavButtons: function renderSkipPart2NavButtons() {
    return /*#__PURE__*/React.createElement("div", {
      className: styles.quitTestNavButtons
    }, /*#__PURE__*/React.createElement(BlueButton, {
      buttonType: "medium-size",
      buttonText: "stop test",
      handleClick: this.skipPart2,
      variant: "secondary",
      isSmall: true
    }), /*#__PURE__*/React.createElement(BlueButton, {
      handleClick: this.startPart2,
      buttonText: "try part 2",
      buttonType: "keepworking"
    }));
  },
  bulkSubmit: function bulkSubmit(part) {
    this.setState({
      isSubmitModalOpen: false
    });
    this.props.dispatch({
      type: AT.SUBMIT_TEST,
      part: part
    });
  },
  skipPart2: function skipPart2() {
    this.props.dispatch({
      type: AT.SKIP_TEST_PART_2
    });
  },
  startPart2: function startPart2() {
    this.props.dispatch({
      type: AT.START_TEST_PART_2
    });
  },
  quitTest: function quitTest() {
    this.props.dispatch({
      type: AT.QUIT_TEST_BLOCK_REQUEST,
      blockID: _.get(this.props.result, "source.blockID", null)
    });
  },
  createProgressButton: function createProgressButton(props, i, cellSize, cellStyle, part, currentProblemRange) {
    var _this$props = this.props,
      result = _this$props.result,
      containerDims = _this$props.containerDims;
    var index = part === 2 ? i + (result.problems.length - currentProblemRange.length) : i;
    var problemURL = URLMake.forProblem(result, index);
    return /*#__PURE__*/React.createElement("div", {
      className: styles.cell,
      key: "p" + (index + 1),
      style: cellStyle
    }, /*#__PURE__*/React.createElement(SetProgressButton, _extends({}, props, {
      problemNumber: index + 1,
      resultID: result.resultID,
      isActive: false,
      isSaved: result.problems[index].saved,
      selectable: true,
      linkTo: problemURL,
      cellSize: cellSize,
      containerDims: containerDims
    })));
  },
  handleTrayClick: function handleTrayClick(button) {
    if (button === "info") {
      if (this.props.showInstructions) {
        this.setState({
          instructionsWillClose: true
        });
      } else {
        this.handleInstructionsClick();
      }
    }
  },
  handleInstructionsClick: function handleInstructionsClick() {
    this.props.dispatch({
      type: AT.SET_SHOW_INSTRUCTIONS,
      showInstructions: !this.props.showInstructions
    });
  },
  renderSubmitModal: function renderSubmitModal(testInfo) {
    var _this4 = this;
    var part = testInfo.part;
    var result = this.props.result;
    var forBookTest = result.resultType === "bookTest";
    var submitCheck = TrainerCore.checkTestSubmitRestrictions(testInfo, {
      ignoreTime: FLAGS.ignoreBookTestTimeRestriction
    });
    var handleSubmitModalClose = function handleSubmitModalClose() {
      _this4.setState({
        isSubmitModalOpen: false
      });
    };
    var handleCheckClick = function handleCheckClick() {
      _this4.setState({
        isSubmitModalOpen: false
      });
      _this4.props.dispatch({
        type: AT.GOTO_FIRST_PROBLEM
      });
    };
    var checkButtonText = forBookTest ? "testdoublecheck" : "keepworking";
    var submitButtonText = null;
    var handleSubmitClick = null;
    // TODO: Does this if need to exist? It doesn't seem the submit modal
    // can show up if submitting is blocked.
    if (submitCheck.canSubmit) {
      submitButtonText = "submitpart" + part + (forBookTest ? "small" : "");
      handleSubmitClick = function handleSubmitClick() {
        return _this4.bulkSubmit(part);
      };
    }
    return /*#__PURE__*/React.createElement(ConfirmTestModal, {
      onClose: handleSubmitModalClose,
      contents: TrainerCopyTable.forTestOverview("submitModal", testInfo),
      checkButtonText: checkButtonText,
      checkClickHandler: handleCheckClick,
      submitButtonText: submitButtonText,
      submitClickHandler: handleSubmitClick,
      submitButtonToSide: forBookTest,
      gradeNumber: result.source.gradeNumber
    });
  },
  render: function render() {
    var _this5 = this;
    var _this$props2 = this.props,
      result = _this$props2.result,
      containerDims = _this$props2.containerDims,
      user = _this$props2.user,
      showInstructions = _this$props2.showInstructions,
      instructionsViewData = _this$props2.instructionsViewData,
      gradeNumber = _this$props2.gradeNumber;
    var forcePart;
    // Force part info for teachers who can jump between parts
    if (OpsUser.hasTeacherRole(user)) {
      forcePart = _.includes(TrainerCore.getProblemRangeForTestPart(result, 2), result.currentProblemIndex) ? 2 : 1;
    }
    var timeSinceStart = OpsResult.getTimeSinceStart(result, Date.now());
    var testInfo = TrainerCore.getTestInfo(result, timeSinceStart, forcePart);
    var part = testInfo.part,
      currentProblemRange = testInfo.currentProblemRange;
    var progressButtonsDiv, confirmModal, quitModal, skipPart2Modal, navButtons, contents, part1CompleteBeast;
    if (result.showTestPart1Decision) {
      // Part 1 continue or stop

      // Contents
      contents = TrainerCopyTable.forTestOverview("part1Decision", {
        className: styles.part1DecisionText,
        forBookTest: result.resultType === "bookTest"
      });
      part1CompleteBeast = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        className: styles.summary,
        src: AssetsUtil.getTestOverviewBeast("headmaster", result.source.gradeNumber)
      }), /*#__PURE__*/React.createElement(MessageBubble, {
        styleType: "headmaster",
        bubbleType: "testoverview",
        message: "Ready for a challenge? Try part 2!",
        canClose: false,
        colorType: "instructions"
      }));
      navButtons = this.renderPart1DecisionNavButtons();
      if (this.state.isSkipPart2ModalOpen) {
        skipPart2Modal = /*#__PURE__*/React.createElement(ChooseOptionModal, {
          onClose: function onClose() {
            return _this5.setState({
              isSkipPart2ModalOpen: false
            });
          },
          styleType: "quit-test",
          buttonSubstitute: this.renderSkipPart2NavButtons(),
          size: "extra-extra-large"
        }, TrainerCopyTable.forTestOverview("skipPart2", {
          className: styles.quitTestText
        }));
      }
    } else {
      // Standard test overview

      // Confirm Modal
      confirmModal = this.state.isSubmitModalOpen ? this.renderSubmitModal(testInfo) : null;

      // Quit modal
      if (this.state.isQuitModalOpen) {
        quitModal = /*#__PURE__*/React.createElement(ChooseOptionModal, {
          onClose: function onClose() {
            return _this5.setState({
              isQuitModalOpen: false
            });
          },
          styleType: "quit-test",
          buttonSubstitute: this.renderQuitTestNavButtons(),
          size: "extra-extra-large"
        }, TrainerCopyTable.forTestOverview("quitModal", {
          className: styles.quitTestText
        }));
      }

      // Progress Buttons
      var cellSize = Math.max(35, containerDims.width / 25);
      var cellStyle = {
        width: cellSize,
        height: cellSize
      };
      var progressProps = _.filter(this.state.progressProps, function (p, i) {
        return _.includes(currentProblemRange, i);
      });
      var progressButtons = progressProps ? progressProps.map(function (p, ind) {
        return _this5.createProgressButton(p, ind, cellSize, cellStyle, part, currentProblemRange);
      }) : null;
      if (part === 1) {
        var rowLength = Math.ceil(progressButtons.length / 2);
        progressButtonsDiv = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
          className: styles.progress
        }, _.slice(progressButtons, 0, rowLength)), /*#__PURE__*/React.createElement("div", {
          className: styles.progress
        }, _.slice(progressButtons, rowLength)));
      } else {
        progressButtonsDiv = /*#__PURE__*/React.createElement("div", {
          className: styles.progress
        }, progressButtons);
      }

      // Nav buttons
      navButtons = this.renderProblemOverviewNavButtons(testInfo);

      // Contents
      var submitCheck = TrainerCore.checkTestSubmitRestrictions(testInfo, {
        ignoreTime: FLAGS.ignoreBookTestTimeRestriction
      });
      var summaryCopy = TrainerCopyTable.forTestSummary({
        testInfo: testInfo,
        submitCheck: submitCheck
      });
      contents = /*#__PURE__*/React.createElement("div", {
        className: styles.review
      }, /*#__PURE__*/React.createElement("p", null, summaryCopy.above), progressButtonsDiv, /*#__PURE__*/React.createElement("p", null, summaryCopy.below));
    }
    var styleType = BlockStyle.getType({
      result: result
    });
    var styleColor = BlockStyle.getColor({
      result: result
    });
    var trayRight = /*#__PURE__*/React.createElement(Tray, {
      type: "right",
      buttons: ["info"],
      styleType: styleType,
      styleColor: styleColor,
      handleClick: this.handleTrayClick,
      showTray: true
    });
    var instructionsOpen = showInstructions && !!instructionsViewData;
    var instructionsModal = null;
    if (instructionsOpen) {
      instructionsModal = /*#__PURE__*/React.createElement(ShowInstructionsView, {
        onClose: this.handleInstructionsClick,
        styleType: styleType,
        instructionsViewData: instructionsViewData,
        willOpen: !this.state.instructionsWillClose,
        isBeginningBlock: false,
        hasHistory: false,
        customState: result.instructionsState,
        containerDims: containerDims,
        result: result,
        gradeNumber: result.source.gradeNumber,
        user: user
      });
    }
    return /*#__PURE__*/React.createElement("div", {
      className: styles.main
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.engine
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.outer
    }, gradeNumber === 1 && /*#__PURE__*/React.createElement(ReadAloudButton, {
      readAloudType: "testOverview"
    }), /*#__PURE__*/React.createElement("img", {
      className: styles.engineBg,
      src: globalThis.BASE_URL + "assets/images/elements/playarea-area.svg"
    }), part1CompleteBeast, /*#__PURE__*/React.createElement("div", {
      id: "testOverviewContent"
    }, contents), navButtons)), quitModal, skipPart2Modal, confirmModal, /*#__PURE__*/React.createElement(SliderController, {
      animKey: "trainer-solution",
      styleType: result.styleType,
      gradeNumber: result.source.gradeNumber,
      message: this.state.sliderMessage,
      generation: this.state.sliderGeneration,
      specialType: this.state.sliderSpecialType
    }), /*#__PURE__*/React.createElement(Portal, {
      container: PORTAL_CONTAINERS.TOOLTRAYS_RIGHT
    }, trayRight), /*#__PURE__*/React.createElement(Portal, {
      container: PORTAL_CONTAINERS.INSTRUCTIONS_MODAL
    }, instructionsModal));
  }
}));

/***/ },

/***/ "./src/trainer/reactView/PageChapter.jsx"
/*!***********************************************!*\
  !*** ./src/trainer/reactView/PageChapter.jsx ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var _require = __webpack_require__(/*! ../../core/view/PortalDestination.tsx */ "./src/core/view/PortalDestination.tsx"),
  PortalDestination = _require.PortalDestination;
var _require2 = __webpack_require__(/*! ../../../shared/PortalConstants.ts */ "./shared/PortalConstants.ts"),
  PORTAL_CONTAINERS = _require2.PORTAL_CONTAINERS;
var AT = __webpack_require__(/*! ../../core/vault/ActionTypes.js */ "./src/core/vault/ActionTypes.js");
var _require3 = __webpack_require__(/*! ../../core/vault/StateCursors.js */ "./src/core/vault/StateCursors.js"),
  atChapters = _require3.atChapters,
  atChapterByParams = _require3.atChapterByParams,
  atDemo = _require3.atDemo,
  atLibraryChaptersByGrade = _require3.atLibraryChaptersByGrade,
  atPageUser = _require3.atPageUser,
  atTempUser = _require3.atTempUser,
  atUserAssignedBlocks = _require3.atUserAssignedBlocks;
var LoadState = __webpack_require__(/*! ../../core/vault/util/LoadState.js */ "./src/core/vault/util/LoadState.js");
var Derived = __webpack_require__(/*! ../../core/vault/Derived.js */ "./src/core/vault/Derived.js");
var OpsChapterPath = __webpack_require__(/*! ../../core/vault/OpsChapterPath.js */ "./src/core/vault/OpsChapterPath.js");
var OpsUser = __webpack_require__(/*! ../../core/vault/OpsUser.js */ "./src/core/vault/OpsUser.js");
var withVaultDispatch = __webpack_require__(/*! ../../core/hoc/withVaultDispatch.jsx */ "./src/core/hoc/withVaultDispatch.jsx");
var withVaultUpdate = __webpack_require__(/*! ../../core/hoc/withVaultUpdate.jsx */ "./src/core/hoc/withVaultUpdate.jsx");
var withSetURL = __webpack_require__(/*! ../../core/hoc/withSetURL.jsx */ "./src/core/hoc/withSetURL.jsx");
var ErrorUtil = __webpack_require__(/*! ../../../shared/ErrorUtil.js */ "./shared/ErrorUtil.js");
var Sounds = __webpack_require__(/*! ../../core/util/Sounds.js */ "./src/core/util/Sounds.js");
var dbDemoData = __webpack_require__(/*! ../../../shared/data/dbDemoData.json */ "./shared/data/dbDemoData.json");
var GradeChapter = __webpack_require__(/*! ../../../shared/GradeChapter.js */ "./shared/GradeChapter.js");
var TrainerPageWrapper = __webpack_require__(/*! ./TrainerPageWrapper.jsx */ "./src/trainer/reactView/TrainerPageWrapper.jsx");
var MultiLoadGuard = __webpack_require__(/*! ../../core/view/MultiLoadGuard.jsx */ "./src/core/view/MultiLoadGuard.jsx");
var ChapterPathContainer = __webpack_require__(/*! ./ChapterPathContainer.jsx */ "./src/trainer/reactView/ChapterPathContainer.jsx");
var ReactPageTrainerError = __webpack_require__(/*! ../../core/view/ReactPageTrainerError.jsx */ "./src/core/view/ReactPageTrainerError.jsx");

// const styles = require("./styles/PageChapter.css");

var demoLibraryGrade = function demoLibraryGrade(chapterID) {
  return {
    model: {
      chapterID: chapterID,
      isCompletelyRead: false,
      lastFailTime: null,
      lastPageVisited: null,
      pagesRead: [],
      updateFails: null
    }
  };
};

// Helper for HOC setup
var getPropsFromVault = function getPropsFromVault(props, vaultState) {
  var demo = props.demo,
    gradeNumber = props.gradeNumber,
    chapterIndex = props.chapterIndex;
  var user = atPageUser(vaultState).get();
  var avatarChapterID = OpsChapterPath.getChapterIDForAvatar(vaultState);
  var chapter = atChapterByParams(vaultState, gradeNumber, chapterIndex).get();
  var customScope = OpsUser.getCustomScopeForUser(user);
  var demoInfoLoaded = function () {
    if (!demo) return {
      load: "none"
    };
    var loadedChapters = atTempUser(vaultState).getIn("chapters");
    // NOTE: This would only be missing on the initial load - after it's saved in the user's
    // storage, the chapter info is all there and this will just be done from then on.
    if (!loadedChapters) return {
      load: "none"
    };
    var chapterIDs = dbDemoData.chapterIDs;
    var allLoaded = chapterIDs.every(function (chapterID) {
      var _loadedChapters$chapt;
      return ((_loadedChapters$chapt = loadedChapters[chapterID]) === null || _loadedChapters$chapt === void 0 ? void 0 : _loadedChapters$chapt.load) === "done";
    });
    return allLoaded ? {
      load: "done"
    } : {
      load: "none"
    };
  }();
  var demoTutorialShown = demo ? atDemo(vaultState).getIn("showing") : null;
  if (!chapter || _.isNaN(gradeNumber) || _.isNaN(chapterIndex)) {
    return {
      user: user,
      chapter: Derived.getBadChapter(),
      previousChapterID: null,
      nextChapterID: null,
      demoInfoLoaded: demoInfoLoaded,
      demoTutorialShown: demoTutorialShown,
      numUnfinishedBlocks: 0,
      skipUnfinishedMessage: true
    };
  }
  var chapterID = chapter.chapterID;
  var _GradeChapter$getAdja = GradeChapter.getAdjacentChapters(gradeNumber, chapterIndex, customScope),
    previous = _GradeChapter$getAdja.previous,
    next = _GradeChapter$getAdja.next;
  var previousChapter, nextChapter;
  if (previous) {
    previousChapter = atChapterByParams(vaultState, previous.gradeNumber, previous.chapterIndex).get();
  }
  if (next) {
    nextChapter = atChapterByParams(vaultState, next.gradeNumber, next.chapterIndex).get();
  }
  var numUnfinishedBlocks = Number(Derived.getUnfinishedChapterBlocks(vaultState, chapterID).length);
  var userAssignedBlocks = atUserAssignedBlocks(vaultState).get();
  var libraryPages = Derived.getLibraryPagesForChapter(vaultState, chapter.chapterID);
  var libraryGrade = atLibraryChaptersByGrade(vaultState, gradeNumber).get();
  return {
    chapters: atChapters(vaultState).get(),
    avatarChapterID: avatarChapterID,
    user: user,
    userAssignedBlocks: userAssignedBlocks,
    chapter: chapter,
    previousChapter: previousChapter,
    nextChapter: nextChapter,
    previousChapterID: _.get(previous, "id", null),
    nextChapterID: _.get(next, "id", null),
    numUnfinishedBlocks: numUnfinishedBlocks,
    skipUnfinishedMessage: !!OpsUser.hasKey(user, "trainer no warnings"),
    demoInfoLoaded: demoInfoLoaded,
    demoTutorialShown: demoTutorialShown,
    libraryPages: libraryPages,
    libraryGrade: libraryGrade
  };
};

// Helper to apply higher-order components.
var augment = function augment(Component) {
  Component = withSetURL(Component);
  Component = withVaultDispatch(Component);
  Component = withVaultUpdate(Component, getPropsFromVault);
  return Component;
};
var PageChapter = augment(createReactClass({
  displayName: "PageChapter",
  propTypes: {
    gradeNumber: PT.any,
    chapterIndex: PT.any,
    demo: PT.bool,
    showBook: PT.bool,
    showBookSectionID: PT.number,
    // Injected by HOCs
    chapters: PT.object,
    avatarChapterID: PT.number,
    user: PT.object.isRequired,
    userAssignedBlocks: PT.object,
    chapter: PT.object,
    previousChapter: PT.object,
    nextChapter: PT.object,
    previousChapterID: PT.number,
    nextChapterID: PT.number,
    numUnfinishedBlocks: PT.number,
    skipUnfinishedMessage: PT.bool,
    dispatch: PT.func.isRequired,
    demoInfoLoaded: PT.object,
    demoTutorialShown: PT.string,
    setURL: PT.func.isRequired,
    libraryPages: PT.object,
    libraryGrade: PT.object
  },
  getInitialState: function getInitialState() {
    var _this = this;
    this.dispatchTimeoutIDs = [];
    this.dispatchWithDelay = function (action) {
      _this.dispatchTimeoutIDs.push(setTimeout(function () {
        return _this.props.dispatch(action);
      }, 100));
    };
    this.clearDelayedDispatches = function () {
      _this.dispatchTimeoutIDs.forEach(function (id) {
        return clearTimeout(id);
      });
    };
    return {
      reactCrashed: false,
      reactCrashOutOfMemory: false
    };
  },
  componentDidMount: function componentDidMount() {
    Sounds.playMusic("general-background");
    var chapterLoaded = _.get(this.props, "chapter.load") === "done";
    if (chapterLoaded && !this.props.demo) this.loadAdditionalChapters();
  },
  componentDidUpdate: function componentDidUpdate() {
    var chapterLoaded = _.get(this.props, "chapter.load") === "done";
    if (chapterLoaded && !this.props.demo) this.loadAdditionalChapters();
  },
  componentWillUnmount: function componentWillUnmount() {
    this.clearDelayedDispatches();
  },
  UNSAFE_componentWillReceiveProps: function UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.chapter && nextProps.chapter && this.props.chapter.chapterID !== nextProps.chapter.chapterID) {
      this.clearDelayedDispatches();
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
  loadChapter: function loadChapter(chapterID) {
    var anticipated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var status = this.getChapterStatus(chapterID);
    // exit if this chapter has already been loaded
    if (status.load === "done") return;
    var userID = this.props.user.userID;
    var type = anticipated ? AT.LOAD_CHAPTER_ANTICIPATED_REQUEST : AT.LOAD_CHAPTER_REQUEST;
    var dispatch = anticipated ? this.dispatchWithDelay : this.props.dispatch;
    dispatch({
      type: type,
      userID: userID,
      chapterID: chapterID
    });
  },
  loadLibraryChapter: function loadLibraryChapter() {
    var _this$props = this.props,
      gradeNumber = _this$props.gradeNumber,
      user = _this$props.user;
    var chapterIDs = GradeChapter.getAllChaptersForGrade(gradeNumber) || [];
    if (chapterIDs.length > 0) {
      this.dispatchWithDelay({
        type: AT.LOAD_LIBRARY_CHAPTERS_REQUEST,
        userID: user.userID,
        chapterIDs: chapterIDs,
        debugInfo: {
          stack: Error().stack,
          props: this.props
        }
      });
    }
  },
  loadDemoInfo: function loadDemoInfo() {
    this.props.dispatch({
      type: AT.LOAD_DEMO_CHAPTERS
    });
  },
  getCoreChapterIDs: function getCoreChapterIDs() {
    var _this$props2 = this.props,
      chapter = _this$props2.chapter,
      avatarChapterID = _this$props2.avatarChapterID;
    var chapterIDs = [chapter.chapterID, avatarChapterID].filter(Boolean);
    return chapterIDs;
  },
  getChapterStatus: function getChapterStatus(chapterID) {
    var chapters = this.props.chapters;
    if (!chapters) return {
      load: "none"
    };
    var status = chapters[chapterID];
    if (!status) return {
      load: "none"
    };
    return status;
  },
  getCoreChapterStatus: function getCoreChapterStatus() {
    var chapters = this.props.chapters;
    if (!chapters) return {
      load: "none"
    };
    var coreChapterIDs = this.getCoreChapterIDs();
    var loadedChapterIDs = LoadState.filterByStatus(chapters, "done").map(function (c) {
      return _.get(c, "chapterID");
    });
    var unloadedChapterIDs = _.difference(coreChapterIDs, loadedChapterIDs);
    if (unloadedChapterIDs.length > 0) {
      // if there's a new chapter to load
      return {
        load: "none"
      };
    }
    var coreChapters = Object.values(chapters).filter(function (c) {
      return coreChapterIDs.includes(_.get(c, "chapterID"));
    });
    var load = LoadState.reduceToSingleLoad(coreChapters);
    return {
      load: load
    };
  },
  getLibraryChapterStatus: function getLibraryChapterStatus() {
    var _this$props3 = this.props,
      demo = _this$props3.demo,
      libraryGrade = _this$props3.libraryGrade;
    if (demo) return {
      load: "done"
    };
    if (!libraryGrade) return {
      load: "none"
    };
    return libraryGrade;
  },
  /**
   * Loads the chapters necessary for the functionality of this page, including the current
   * chapter, the chapter of the user's last-played lesson/reading and their previous/next
   * chapters.
   */
  loadCoreChapters: function loadCoreChapters() {
    var _this2 = this;
    var chapterIDs = this.getCoreChapterIDs();
    chapterIDs.forEach(function (chapterID) {
      _this2.loadChapter(chapterID, false);
    });
  },
  /**
   * Loads the chapters before and after the current chapter, if they haven't been loaded already.
   */
  loadAdditionalChapters: function loadAdditionalChapters() {
    var _this3 = this;
    var _this$props4 = this.props,
      previousChapterID = _this$props4.previousChapterID,
      nextChapterID = _this$props4.nextChapterID;
    var anticipatedChapterIDs = _.filter(_.uniq([previousChapterID, nextChapterID]), function (id) {
      return id;
    });
    anticipatedChapterIDs.forEach(function (chapterID) {
      _this3.loadChapter(chapterID, true);
    });
  },
  renderChapterPath: function renderChapterPath() {
    var _this$props5 = this.props,
      demo = _this$props5.demo,
      user = _this$props5.user,
      chapter = _this$props5.chapter,
      libraryGrade = _this$props5.libraryGrade,
      previousChapter = _this$props5.previousChapter,
      nextChapter = _this$props5.nextChapter,
      userAssignedBlocks = _this$props5.userAssignedBlocks,
      numUnfinishedBlocks = _this$props5.numUnfinishedBlocks,
      skipUnfinishedMessage = _this$props5.skipUnfinishedMessage;
    var libraryChapter = demo ? demoLibraryGrade(chapter.chapterID) : libraryGrade[chapter.chapterID];
    return /*#__PURE__*/React.createElement(ChapterPathContainer, {
      chapter: chapter,
      demo: !!demo,
      libraryChapter: libraryChapter,
      numUnfinishedBlocks: numUnfinishedBlocks,
      skipUnfinishedMessage: skipUnfinishedMessage,
      user: user,
      nextChapter: nextChapter,
      previousChapter: previousChapter,
      userAssignedBlocks: userAssignedBlocks
    });
  },
  render: function render() {
    var _this$props6 = this.props,
      chapter = _this$props6.chapter,
      chapterIndex = _this$props6.chapterIndex,
      demo = _this$props6.demo,
      demoInfoLoaded = _this$props6.demoInfoLoaded,
      demoTutorialShown = _this$props6.demoTutorialShown,
      gradeNumber = _this$props6.gradeNumber,
      libraryGrade = _this$props6.libraryGrade,
      libraryPages = _this$props6.libraryPages,
      showBook = _this$props6.showBook,
      showBookSectionID = _this$props6.showBookSectionID,
      user = _this$props6.user;
    var chapterPath = null;
    if (this.state.reactCrashed) {
      chapterPath = /*#__PURE__*/React.createElement(ReactPageTrainerError, {
        isReactCrash: true,
        outOfMemory: this.state.reactCrashOutOfMemory
      });
    } else {
      var guardList = [{
        identifier: "chapterPath" + (demo ? "demo" : chapter.chapterID),
        status: demo ? demoInfoLoaded : this.getCoreChapterStatus(),
        requestLoad: demo ? this.loadDemoInfo : this.loadCoreChapters
      }, {
        identifier: "libraryChapter" + (demo ? "demo" : chapter.chapterID),
        status: this.getLibraryChapterStatus(),
        requestLoad: demo ? function () {} : this.loadLibraryChapter
      }];
      chapterPath = /*#__PURE__*/React.createElement(MultiLoadGuard, {
        guardList: guardList,
        loadingView: "logo",
        logoColorType: "white",
        errorView: "refresh",
        chapterLoadingBackground: true,
        renderLoaded: this.renderChapterPath
      });
    }
    var wrapperProps = {
      gradeNumber: parseInt(gradeNumber),
      chapterIndex: parseInt(chapterIndex),
      user: user,
      chapter: chapter,
      navTooltipProps: {
        size: "medium",
        stretchWidth: true
      },
      demo: demo,
      demoTutorialShown: demoTutorialShown,
      showBook: showBook,
      showBookSectionID: showBookSectionID,
      libraryPages: libraryPages,
      libraryChapter: demo ? demoLibraryGrade(chapter.chapterID) : _.get(libraryGrade, chapter.chapterID, {})
    };
    return /*#__PURE__*/React.createElement(TrainerPageWrapper, wrapperProps, /*#__PURE__*/React.createElement(PortalDestination, {
      name: PORTAL_CONTAINERS.DEMO_TUTORIAL_MODAL
    }), chapterPath);
  }
}));
module.exports = PageChapter;

/***/ },

/***/ "./src/trainer/reactView/PageDevEngineTester.jsx"
/*!*******************************************************!*\
  !*** ./src/trainer/reactView/PageDevEngineTester.jsx ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var AT = __webpack_require__(/*! ../../core/vault/ActionTypes.js */ "./src/core/vault/ActionTypes.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var _require = __webpack_require__(/*! ../../core/vault/StateCursors.js */ "./src/core/vault/StateCursors.js"),
  atDevProblem = _require.atDevProblem,
  atUser = _require.atUser,
  atTempUser = _require.atTempUser,
  atPage = _require.atPage;
var withVaultUpdate = __webpack_require__(/*! ../../core/hoc/withVaultUpdate.jsx */ "./src/core/hoc/withVaultUpdate.jsx");
var withVaultDispatch = __webpack_require__(/*! ../../core/hoc/withVaultDispatch.jsx */ "./src/core/hoc/withVaultDispatch.jsx");
var DevProblemView = __webpack_require__(/*! ./DevProblemView.jsx */ "./src/trainer/reactView/DevProblemView.jsx");

/**
 * Page for testing the engine.
 *
 * Works similarly to PageDevProblem, but with arbitrary problem data.
 */

// Helper to apply higher-order components.
var augment = function augment(Component) {
  Component = withVaultUpdate(Component, function (props, vaultState) {
    var user = props.demo ? atTempUser(vaultState).get() : atUser(vaultState).get();
    var devProblemCR = atDevProblem(vaultState);
    var showInstructions = atPage(vaultState).getIn("showInstructions");
    return {
      user: user,
      result: devProblemCR.getIn("result"),
      blockInfo: devProblemCR.getIn("blockInfo"),
      isIdle: vaultState.idle,
      showInstructions: showInstructions
    };
  });
  return Component;
};
module.exports = augment(createReactClass({
  displayName: "PageDevEngineTester",
  propTypes: {
    // Injected by HOCs
    user: PT.object,
    result: PT.object,
    blockInfo: PT.object,
    isIdle: PT.bool,
    showInstructions: PT.bool
  },
  getInitialState: function getInitialState() {
    return {
      reactCrashed: false
    };
  },
  componentDidCatch: function componentDidCatch(error, info) {
    // If an error in a dev problem gets caught, just set a flag
    // to pull down the engine from the page.
    this.setState({
      reactCrashed: true
    });
  },
  render: function render() {
    var _this$props = this.props,
      result = _this$props.result,
      isIdle = _this$props.isIdle,
      blockInfo = _this$props.blockInfo,
      showInstructions = _this$props.showInstructions;
    if (!result) {
      return /*#__PURE__*/React.createElement(DevProblemDataSetter, null);
    }
    return /*#__PURE__*/React.createElement(DevProblemView, {
      result: result,
      blockInfo: blockInfo,
      isIdle: isIdle,
      reactCrashed: this.state.reactCrashed,
      devProblemName: "Test Problem",
      showInstructions: showInstructions,
      user: this.props.user
    });
  }
}));

// Example problem data for fill drill.
// TODO: Figure out how to get the resultType based on the rendererID.
var testProblemData = "{\n\t\"rendererID\": 174,\n\t\"resultType\": \"fillDrill\",\n\t\"problemText\": \"Fill it up.\",\n\t\"problemType\": \"easySubtraction\",\n\t\"keyboard\": [\"1\",\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"0\",\"backspace\"],\n\t\"totalProblems\": 50,\n\t\"leakLevelDecrease\": 0.25,\n\t\"pourLevelIncrease\": 0.8,\n\t\"secondsPerProblemPerHole\": [\n\t\t34,\n\t\t18,\n\t\t12\n\t],\n\t\"isDisplay\": false,\n\t\"volumePerPour\": [1,2,3],\n\t\"volumePerStar\": [10,20,30],\n\t\"pourSpeedCutoffs\": [5,10]\n}";

/**
 * Component with a textarea and a submit button to set the devProblemData.
 *
 * On submit, also dispatches an action to set up the necessary vault state.
 */
var DevProblemDataSetter = function DevProblemDataSetter(_ref) {
  var dispatch = _ref.dispatch;
  var _React$useState = React.useState(testProblemData),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    devProblemData = _React$useState2[0],
    setDevProblemData = _React$useState2[1];
  var onClickSubmit = function onClickSubmit() {
    var problemData = JSON.parse(devProblemData);
    dispatch({
      type: AT.SET_ENGINE_TESTER_PROBLEM,
      problemData: problemData
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      margin: "auto",
      padding: "80px",
      fontSize: "14px"
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: "30",
    cols: "80",
    value: devProblemData,
    onChange: function onChange(e) {
      return setDevProblemData(e.target.value);
    },
    style: {
      fontFamily: "monospace"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onClickSubmit
  }, "Submit"));
};
DevProblemDataSetter.propTypes = {
  dispatch: PT.func.isRequired
};
DevProblemDataSetter = withVaultDispatch(DevProblemDataSetter);

/***/ },

/***/ "./src/trainer/reactView/PageDevProblem.jsx"
/*!**************************************************!*\
  !*** ./src/trainer/reactView/PageDevProblem.jsx ***!
  \**************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var _require = __webpack_require__(/*! ../../core/vault/StateCursors.js */ "./src/core/vault/StateCursors.js"),
  atDevProblem = _require.atDevProblem,
  atUser = _require.atUser,
  atTempUser = _require.atTempUser;
var withVaultUpdate = __webpack_require__(/*! ../../core/hoc/withVaultUpdate.jsx */ "./src/core/hoc/withVaultUpdate.jsx");
var NotFound = __webpack_require__(/*! ../../core/view/NotFound.jsx */ "./src/core/view/NotFound.jsx");
var DevProblemView = __webpack_require__(/*! ./DevProblemView.jsx */ "./src/trainer/reactView/DevProblemView.jsx");

// Helper to apply higher-order components.
var augment = function augment(Component) {
  Component = withVaultUpdate(Component, function (props, vaultState) {
    var user = props.demo ? atTempUser(vaultState).get() : atUser(vaultState).get();
    var devProblemCR = atDevProblem(vaultState);
    return {
      user: user,
      result: devProblemCR.getIn("result"),
      blockInfo: devProblemCR.getIn("blockInfo"),
      isIdle: vaultState.idle
    };
  });
  return Component;
};
module.exports = augment(createReactClass({
  displayName: "PageDevProblem",
  propTypes: {
    devProblemName: PT.string,
    showInstructions: PT.bool,
    // Injected by HOCs
    user: PT.object,
    result: PT.object,
    blockInfo: PT.object,
    isIdle: PT.bool
  },
  getInitialState: function getInitialState() {
    return {
      reactCrashed: false
    };
  },
  componentDidCatch: function componentDidCatch(error, info) {
    // If an error in a dev problem gets caught, just set a flag
    // to pull down the engine from the page.
    this.setState({
      reactCrashed: true
    });
  },
  UNSAFE_componentWillReceiveProps: function UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.result !== this.props.result) {
      //Reset the reactCrashed flag when switching dev problems
      this.setState({
        reactCrashed: false
      });
    }
  },
  render: function render() {
    var _this$props = this.props,
      result = _this$props.result,
      blockInfo = _this$props.blockInfo,
      isIdle = _this$props.isIdle;
    if (!result) {
      return /*#__PURE__*/React.createElement(NotFound, null);
    }
    return /*#__PURE__*/React.createElement(DevProblemView, {
      result: result,
      blockInfo: blockInfo,
      isIdle: isIdle,
      reactCrashed: this.state.reactCrashed,
      devProblemName: this.props.devProblemName,
      showInstructions: this.props.showInstructions,
      user: this.props.user
    });
  }
}));

/***/ },

/***/ "./src/trainer/reactView/PageHistory.jsx"
/*!***********************************************!*\
  !*** ./src/trainer/reactView/PageHistory.jsx ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var AT = __webpack_require__(/*! ../../core/vault/ActionTypes.js */ "./src/core/vault/ActionTypes.js");
var _require = __webpack_require__(/*! ../../core/vault/StateCursors.js */ "./src/core/vault/StateCursors.js"),
  atDemo = _require.atDemo,
  atPageUser = _require.atPageUser,
  atChapterByPage = _require.atChapterByPage,
  atBlockByPage = _require.atBlockByPage,
  atLibraryChapter = _require.atLibraryChapter,
  atTheaterSet = _require.atTheaterSet;
var Derived = __webpack_require__(/*! ../../core/vault/Derived.js */ "./src/core/vault/Derived.js");
var ErrorUtil = __webpack_require__(/*! ../../../shared/ErrorUtil.js */ "./shared/ErrorUtil.js");
var withVaultDispatch = __webpack_require__(/*! ../../core/hoc/withVaultDispatch.jsx */ "./src/core/hoc/withVaultDispatch.jsx");
var withVaultUpdate = __webpack_require__(/*! ../../core/hoc/withVaultUpdate.jsx */ "./src/core/hoc/withVaultUpdate.jsx");
var withSetURL = __webpack_require__(/*! ../../core/hoc/withSetURL.jsx */ "./src/core/hoc/withSetURL.jsx");
var withBundleLoading = __webpack_require__(/*! ../../core/hoc/withBundleLoading.jsx */ "./src/core/hoc/withBundleLoading.jsx");
var Bundles = __webpack_require__(/*! ../../core/Bundles.js */ "./src/core/Bundles.js");
var GradeChapter = __webpack_require__(/*! ../../../shared/GradeChapter.js */ "./shared/GradeChapter.js");
var LoadGuard = __webpack_require__(/*! ../../core/view/LoadGuard.jsx */ "./src/core/view/LoadGuard.jsx");
var TrainerPageWrapper = __webpack_require__(/*! ./TrainerPageWrapper.jsx */ "./src/trainer/reactView/TrainerPageWrapper.jsx");
var ReactPageTrainerError = __webpack_require__(/*! ../../core/view/ReactPageTrainerError.jsx */ "./src/core/view/ReactPageTrainerError.jsx");
var URLMake = __webpack_require__(/*! ../../../shared/URLMake.js */ "./shared/URLMake.js");
var SummaryHistory = __webpack_require__(/*! ./SummaryHistory.jsx */ "./src/trainer/reactView/SummaryHistory.jsx");
var Engine = __webpack_require__(/*! ./Engine.jsx */ "./src/trainer/reactView/Engine.jsx");
var ResultManager = __webpack_require__(/*! ../../../shared/ResultManager.js */ "./shared/ResultManager.js");
var InstructionsUtil = __webpack_require__(/*! ../util/InstructionsUtil.js */ "./src/trainer/util/InstructionsUtil.js");
var _require2 = __webpack_require__(/*! ../../core/view/PortalDestination.tsx */ "./src/core/view/PortalDestination.tsx"),
  PortalDestination = _require2.PortalDestination;
var _require3 = __webpack_require__(/*! ../../../shared/PortalConstants.ts */ "./shared/PortalConstants.ts"),
  PORTAL_CONTAINERS = _require3.PORTAL_CONTAINERS;

// Helper for HOC setup
var getPropsFromVault = function getPropsFromVault(props, vaultState) {
  var user = atPageUser(vaultState).get();
  var chapter = atChapterByPage(vaultState, props).get() || Derived.getBadChapter();
  var block = atBlockByPage(vaultState, props).get() || Derived.getBadBlock();
  var theaterSet = {};
  if (_.get(block, "history.load") === "done") {
    theaterSet = atTheaterSet(vaultState, block.model.videoSetID).get();
  }
  var results = [];
  var lastCompleteResult;
  var problem, instructionsViewData;
  var libraryChapter = atLibraryChapter(vaultState, chapter.chapterID).get();
  var libraryPages = Derived.getLibraryPagesForChapter(vaultState, chapter.chapterID);
  if (block.currentResult || block.history) {
    results = block.history.allResults;
    lastCompleteResult = _.find(results, function (r) {
      return r.resultType === "test" && r.hasQuit || r.isComplete || r.hasIntervened || ResultManager(r).neverResumeResult;
    });
    if (_.isNumber(props.problemIndex) && lastCompleteResult && lastCompleteResult.problems) {
      problem = lastCompleteResult.problems[props.problemIndex];
      instructionsViewData = InstructionsUtil.getInstructionsViewData({
        vaultState: vaultState,
        user: user,
        block: block,
        result: lastCompleteResult,
        problem: problem,
        problemIndex: props.problemIndex
      });
    }
  }
  var demoTutorialShown = props.demo ? atDemo(vaultState).getIn("showing") : null;
  var demoReplayBlockId = props.demo ? atDemo(vaultState).getIn(["actions", "replayLesson"]) : null;
  return {
    user: user,
    chapter: chapter,
    block: block,
    theaterSet: theaterSet,
    problem: problem,
    libraryChapter: libraryChapter,
    libraryPages: libraryPages,
    lastCompleteResult: lastCompleteResult,
    instructionsViewData: instructionsViewData,
    isIdle: vaultState.idle,
    connected: vaultState.connected,
    demoTutorialShown: demoTutorialShown,
    demoReplayBlockId: demoReplayBlockId
  };
};

// Helper to apply higher-order components.
var augment = function augment(Component) {
  Component = withBundleLoading(Component);
  Component = withVaultDispatch(Component);
  Component = withSetURL(Component);
  Component = withVaultUpdate(Component, getPropsFromVault);
  return Component;
};
module.exports = augment(createReactClass({
  displayName: "PageHistory",
  propTypes: {
    gradeNumber: PT.number.isRequired,
    chapterIndex: PT.number.isRequired,
    blockIndex: PT.number,
    blockType: PT.string.isRequired,
    problemIndex: PT.any,
    showInstructions: PT.bool,
    showBook: PT.bool,
    showVideo: PT.bool,
    demo: PT.bool,
    // Injected by HOCs
    setURL: PT.func.isRequired,
    demoTutorialShown: PT.string,
    demoReplayBlockId: PT.number,
    requireOrLoadBundle: PT.func.isRequired,
    user: PT.object.isRequired,
    chapter: PT.object.isRequired,
    block: PT.object.isRequired,
    theaterSet: PT.object.isRequired,
    problem: PT.object,
    libraryChapter: PT.object,
    libraryPages: PT.object,
    lastCompleteResult: PT.object,
    instructionsViewData: PT.object,
    dispatch: PT.func.isRequired,
    isIdle: PT.bool,
    connected: PT.bool.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      reactCrashed: false,
      reactCrashOutOfMemory: false
    };
  },
  componentDidMount: function componentDidMount() {
    this.props.requireOrLoadBundle("library");
  },
  componentDidUpdate: function componentDidUpdate() {
    if (Bundles.getStatus("library") === "done" && !_.get(this.props.libraryChapter, "model") && this.props.user.userID) {
      this.loadLibraryChapters();
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
    // Library chapter info not large, so grab all chapters in grade at once
    var chapterIDs = GradeChapter.getAllChaptersForGrade(this.props.gradeNumber);
    // T25484
    if (!this.props.user.userID) {
      ErrorUtil.log("E_LOAD_LIBRARY_NO_USER", "PageHistory " + JSON.stringify(this.props.user));
    }
    this.props.dispatch({
      type: AT.LOAD_LIBRARY_CHAPTERS_ANTICIPATED_REQUEST,
      userID: this.props.user.userID,
      chapterIDs: chapterIDs
    });
  },
  loadChapter: function loadChapter() {
    if (this.props.demo) {
      this.props.dispatch({
        type: AT.LOAD_DEMO_CHAPTER,
        chapterID: this.props.chapter.chapterID
      });
    } else {
      this.props.dispatch({
        type: AT.LOAD_CHAPTER_REQUEST,
        userID: this.props.user.userID,
        chapterID: this.props.chapter.chapterID,
        debugInfo: {
          stack: Error().stack,
          props: this.props
        }
      });
    }
  },
  loadHistory: function loadHistory() {
    this.props.dispatch({
      type: AT.BLOCK_HISTORY_REQUEST,
      blockID: this.props.block.blockID
    });
  },
  isResultInProgress: function isResultInProgress(result) {
    return !result.isComplete && !result.hasIntervened && result.percentComplete > 0;
  },
  renderHistoryLoaded: function renderHistoryLoaded() {
    var _this$props = this.props,
      user = _this$props.user,
      chapter = _this$props.chapter,
      block = _this$props.block,
      problemIndex = _this$props.problemIndex,
      problem = _this$props.problem,
      lastCompleteResult = _this$props.lastCompleteResult,
      dispatch = _this$props.dispatch,
      theaterSet = _this$props.theaterSet,
      demo = _this$props.demo,
      demoReplayBlockId = _this$props.demoReplayBlockId;

    // If block has a video set, load the theater block model.
    if (!demo && theaterSet.load === "none" && _.get(block, "model.videoSetID")) {
      dispatch({
        type: AT.LOAD_THEATER_SET_REQUEST,
        videoSetID: block.model.videoSetID,
        userID: user.userID
      });
    }
    var results = _.get(block, "history.allResults", []);
    var isLastResultBroken = _.get(block, "history.isMostRecentResultBroken", false) || !results.length;
    if (problemIndex === "history" || isLastResultBroken || problemIndex > _.get(lastCompleteResult, "problems.length", 0) - 1) {
      return /*#__PURE__*/React.createElement(SummaryHistory, {
        chapter: chapter,
        block: block,
        results: results,
        userModel: user.model,
        isLastResultBroken: isLastResultBroken,
        demo: demo,
        demoReplayBlockId: demoReplayBlockId
      });
    } else if (problem) {
      var _this$props2 = this.props,
        instructionsViewData = _this$props2.instructionsViewData,
        connected = _this$props2.connected,
        isIdle = _this$props2.isIdle,
        showInstructions = _this$props2.showInstructions;
      var useMiddleInstructions = InstructionsUtil.isMiddleInstructions(block, problem, problemIndex);
      return /*#__PURE__*/React.createElement(Engine, {
        result: lastCompleteResult,
        problem: problem,
        problemIndex: problemIndex,
        instructionsViewData: instructionsViewData,
        useMiddleInstructions: useMiddleInstructions,
        user: user,
        showInstructions: showInstructions,
        forHistory: true,
        connected: connected,
        isIdle: isIdle,
        demo: demo
      });
    }
  },
  renderHistory: function renderHistory() {
    var _this = this;
    var _this$props3 = this.props,
      chapter = _this$props3.chapter,
      block = _this$props3.block,
      chapterIndex = _this$props3.chapterIndex,
      gradeNumber = _this$props3.gradeNumber;
    var buttonInfo = {
      type: "chapter",
      text: "chapter " + (chapterIndex + 1),
      linkTo: URLMake.forChapterFromNumbers(gradeNumber, chapterIndex)
    };
    if (this.state.reactCrashed) {
      return /*#__PURE__*/React.createElement(ReactPageTrainerError, {
        isReactCrash: true,
        problemType: "history",
        buttonInfo: buttonInfo,
        outOfMemory: this.state.reactCrashOutOfMemory
      });
    }

    // Second check: is block and last result loaded?
    var renderBlockLoadGuard = function renderBlockLoadGuard() {
      if (!block.history) {
        _this.props.setURL(URLMake.forChapterFromNumbers(gradeNumber, chapterIndex));
        return null;
      }
      return /*#__PURE__*/React.createElement(LoadGuard, {
        identifier: "blockHistory" + block.blockID,
        status: block.history,
        requestLoad: _this.loadHistory,
        loadingView: "logo",
        errorView: /*#__PURE__*/React.createElement(ReactPageTrainerError, {
          buttonInfo: buttonInfo
        }),
        renderLoaded: _this.renderHistoryLoaded
      });
    };

    // First check: is chapter loaded?
    return /*#__PURE__*/React.createElement(LoadGuard, {
      identifier: "trainerChapter" + chapter.chapterID,
      status: chapter,
      requestLoad: this.loadChapter,
      loadingView: "logo",
      errorView: "refresh",
      renderLoaded: renderBlockLoadGuard
    });
  },
  render: function render() {
    var _this$props4 = this.props,
      user = _this$props4.user,
      chapter = _this$props4.chapter,
      block = _this$props4.block,
      lastCompleteResult = _this$props4.lastCompleteResult,
      demo = _this$props4.demo;
    var results = _.get(block, "history.allResults", []);
    var isLastResultBroken = _.get(block, "history.isMostRecentResultBroken", false);
    var resultToShow = lastCompleteResult;
    var hideSetProgress = isLastResultBroken;
    if (results && ResultManager(resultToShow).noProblemHistory) {
      // we don't want problem buttons
      hideSetProgress = true;
      // but we do want to show star progress on top yellow bar
      resultToShow = results[0];
    }
    var wrapperProps = {
      gradeNumber: this.props.gradeNumber,
      chapterIndex: this.props.chapterIndex,
      blockType: this.props.blockType,
      problemIndex: this.props.problemIndex,
      theaterSet: this.props.theaterSet,
      user: user,
      chapter: chapter,
      block: block,
      result: resultToShow,
      isHistoryPage: true,
      hideSetProgress: hideSetProgress,
      showBook: this.props.showBook,
      showVideo: this.props.showVideo,
      libraryChapter: this.props.libraryChapter,
      libraryPages: this.props.libraryPages,
      demo: demo,
      demoTutorialShown: this.props.demoTutorialShown
    };
    return /*#__PURE__*/React.createElement(TrainerPageWrapper, wrapperProps, /*#__PURE__*/React.createElement(PortalDestination, {
      name: PORTAL_CONTAINERS.DEMO_TUTORIAL_MODAL
    }), this.renderHistory());
  }
}));

/***/ },

/***/ "./src/trainer/reactView/PageProblem.jsx"
/*!***********************************************!*\
  !*** ./src/trainer/reactView/PageProblem.jsx ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var AT = __webpack_require__(/*! ../../core/vault/ActionTypes.js */ "./src/core/vault/ActionTypes.js");
var _require = __webpack_require__(/*! ../../core/vault/StateCursors.js */ "./src/core/vault/StateCursors.js"),
  atDemo = _require.atDemo,
  atUser = _require.atUser,
  atTempUser = _require.atTempUser,
  atChapterByPage = _require.atChapterByPage,
  atBlockByPage = _require.atBlockByPage,
  atResultByPage = _require.atResultByPage,
  atProblemByPage = _require.atProblemByPage,
  atLibraryChapter = _require.atLibraryChapter,
  atTheaterSet = _require.atTheaterSet,
  atChapterPath = _require.atChapterPath;
var Derived = __webpack_require__(/*! ../../core/vault/Derived.js */ "./src/core/vault/Derived.js");
var withVaultDispatch = __webpack_require__(/*! ../../core/hoc/withVaultDispatch.jsx */ "./src/core/hoc/withVaultDispatch.jsx");
var withVaultUpdate = __webpack_require__(/*! ../../core/hoc/withVaultUpdate.jsx */ "./src/core/hoc/withVaultUpdate.jsx");
var withBundleLoading = __webpack_require__(/*! ../../core/hoc/withBundleLoading.jsx */ "./src/core/hoc/withBundleLoading.jsx");
var ImageLoader = __webpack_require__(/*! ../../core/util/ImageLoader.js */ "./src/core/util/ImageLoader.js");
var _require2 = __webpack_require__(/*! ../../core/util/GlobalFlags.js */ "./src/core/util/GlobalFlags.js"),
  FLAGS = _require2.FLAGS,
  FLAG_OPTIONS = _require2.FLAG_OPTIONS;
var ErrorUtil = __webpack_require__(/*! ../../../shared/ErrorUtil.js */ "./shared/ErrorUtil.js");
var GradeChapter = __webpack_require__(/*! ../../../shared/GradeChapter.js */ "./shared/GradeChapter.js");
var ChapterSection = __webpack_require__(/*! ../../../shared/ChapterSection.js */ "./shared/ChapterSection.js");
var Bundles = __webpack_require__(/*! ../../core/Bundles.js */ "./src/core/Bundles.js");
var AssetsUtil = __webpack_require__(/*! ../../core/util/AssetsUtil.js */ "./src/core/util/AssetsUtil.js");
var URLMake = __webpack_require__(/*! ../../../shared/URLMake.js */ "./shared/URLMake.js");
var _require3 = __webpack_require__(/*! ../../core/view/PortalDestination.tsx */ "./src/core/view/PortalDestination.tsx"),
  PortalDestination = _require3.PortalDestination;
var _require4 = __webpack_require__(/*! ../../../shared/PortalConstants.ts */ "./shared/PortalConstants.ts"),
  PORTAL_CONTAINERS = _require4.PORTAL_CONTAINERS;
var LoadState = __webpack_require__(/*! ../../core/vault/util/LoadState.js */ "./src/core/vault/util/LoadState.js");
var LoadGuard = __webpack_require__(/*! ../../core/view/LoadGuard.jsx */ "./src/core/view/LoadGuard.jsx");
var TrainerPageWrapper = __webpack_require__(/*! ./TrainerPageWrapper.jsx */ "./src/trainer/reactView/TrainerPageWrapper.jsx");
var BlankEngine = __webpack_require__(/*! ../../core/view/BlankEngine.jsx */ "./src/core/view/BlankEngine.jsx");
var ReactPageTrainerError = __webpack_require__(/*! ../../core/view/ReactPageTrainerError.jsx */ "./src/core/view/ReactPageTrainerError.jsx");
var Engine = __webpack_require__(/*! ./Engine.jsx */ "./src/trainer/reactView/Engine.jsx");
var Summary = __webpack_require__(/*! ./Summary.jsx */ "./src/trainer/reactView/Summary.jsx");
var OverviewTest = __webpack_require__(/*! ./OverviewTest.jsx */ "./src/trainer/reactView/OverviewTest.jsx");
var InstructionsUtil = __webpack_require__(/*! ../util/InstructionsUtil.js */ "./src/trainer/util/InstructionsUtil.js");
var OpsResult = __webpack_require__(/*! ../vault/OpsResult.js */ "./src/trainer/vault/OpsResult.js");
var OpsUser = __webpack_require__(/*! ../../core/vault/OpsUser.js */ "./src/core/vault/OpsUser.js");
var DevDebugMenu = __webpack_require__(/*! ./DevDebugMenu.jsx */ "./src/trainer/reactView/DevDebugMenu.jsx");

// Helper for HOC setup
var getPropsFromVault = function getPropsFromVault(props, vaultState) {
  var user = props.demo ? atTempUser(vaultState).get() : atUser(vaultState).get();
  var chapter = atChapterByPage(vaultState, props).get() || Derived.getBadChapter();
  var block = atBlockByPage(vaultState, props).get();
  if (!block) block = props.bookTestHash ? LoadState.loadInit({}) : Derived.getBadBlock();
  var theaterSet = {};
  if (block.load === "done" || props.demo && block.model) {
    theaterSet = atTheaterSet(vaultState, block.model.videoSetID).get();
  }
  var result = atResultByPage(vaultState, props).get();
  var problem = atProblemByPage(vaultState, props).get();
  var isNextBlockUnlocked = Derived.getUnlockedStatusForNextBlock(vaultState, block.blockID);
  var sectionID = block.model ? block.model.bookSectionID : null;
  var libraryContext = null;
  var libraryChapterID = chapter.chapterID;
  if (sectionID) {
    libraryChapterID = Number(ChapterSection.getChapterIDFromSectionID(sectionID));
    libraryContext = ChapterSection.getContextFromSectionID(sectionID);
    libraryContext.chapterID = libraryChapterID;
  }
  var libraryChapter = atLibraryChapter(vaultState, libraryChapterID).get();
  var libraryPages = Derived.getLibraryPagesForChapter(vaultState, libraryChapterID);
  var instructionsViewData = InstructionsUtil.getInstructionsViewData({
    vaultState: vaultState,
    user: user,
    block: block,
    result: result,
    problem: problem,
    problemIndex: props.problemIndex
  });
  var demoTutorialShown = props.demo ? atDemo(vaultState).getIn("showing") : null;
  return {
    user: user,
    chapter: chapter,
    block: block,
    theaterSet: theaterSet,
    result: result,
    problem: problem,
    libraryChapter: libraryChapter,
    libraryPages: libraryPages,
    libraryContext: libraryContext,
    chapterPath: atChapterPath(vaultState).get(),
    instructionsViewData: instructionsViewData,
    isNextBlockUnlocked: isNextBlockUnlocked,
    isIdle: vaultState.idle,
    connected: vaultState.connected,
    devWindowsAreHidden: vaultState.devWindowsAreHidden,
    demo: props.demo,
    demoTutorialShown: demoTutorialShown
  };
};

// Helper to apply higher-order components.
var augment = function augment(Component) {
  Component = withBundleLoading(Component);
  Component = withVaultDispatch(Component);
  Component = withVaultUpdate(Component, getPropsFromVault, {});
  return Component;
};
module.exports = augment(createReactClass({
  displayName: "PageProblem",
  propTypes: {
    gradeNumber: PT.number.isRequired,
    chapterIndex: PT.number,
    blockIndex: PT.number,
    // Won't exist for special blocks
    blockType: PT.string.isRequired,
    problemIndex: PT.any,
    setNumber: PT.number,
    showInstructions: PT.bool,
    showBook: PT.bool,
    errorMessageInfo: PT.object,
    showVideo: PT.bool,
    demo: PT.bool,
    videoIntervention: PT.bool,
    bookTestHash: PT.string,
    // Injected by HOCs
    requireOrLoadBundle: PT.func.isRequired,
    demoTutorialShown: PT.string,
    user: PT.object.isRequired,
    chapter: PT.object.isRequired,
    block: PT.object.isRequired,
    theaterSet: PT.object.isRequired,
    result: PT.object,
    problem: PT.object,
    libraryChapter: PT.object,
    libraryPages: PT.object,
    libraryContext: PT.object,
    chapterPath: PT.object.isRequired,
    instructionsViewData: PT.object,
    isNextBlockUnlocked: PT.bool,
    isIdle: PT.bool,
    devWindowsAreHidden: PT.bool,
    connected: PT.bool.isRequired,
    dispatch: PT.func.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      reactCrashed: false,
      reactCrashOutOfMemory: false
    };
  },
  componentDidMount: function componentDidMount() {
    var _this$props = this.props,
      block = _this$props.block,
      demo = _this$props.demo,
      dispatch = _this$props.dispatch,
      errorMessageInfo = _this$props.errorMessageInfo,
      requireOrLoadBundle = _this$props.requireOrLoadBundle;
    requireOrLoadBundle("library");
    // Preload stars and rectangles for summary page
    ImageLoader.preload([AssetsUtil.getSummaryRect("results"), AssetsUtil.getSummaryRect(0), AssetsUtil.getSummaryRect(1), AssetsUtil.getSummaryRect(2), AssetsUtil.getStarEarned(1, true), AssetsUtil.getStarEarned(2, true), AssetsUtil.getStarEarned(3, true)]);
    if (errorMessageInfo && (errorMessageInfo.messageType === "testInProgress" || errorMessageInfo.messageType === "bookTestInProgress")) {
      var data = _.extend(errorMessageInfo.data, {
        cannotClose: true
      });
      dispatch({
        type: AT.SHOW_MESSAGE,
        messageType: errorMessageInfo.messageType,
        data: data
      });
    } else if (errorMessageInfo) {
      dispatch(_.extend({
        type: AT.SHOW_MESSAGE
      }, errorMessageInfo));
    }

    /**
     * We need this for the demo because a demo block's load state is saved to storage
     * on the first load, so the PLAY_DEMO_BLOCK action is only called the first time.
     */
    if (demo) {
      var _$get = _.get(block, "model", {}),
        blockID = _$get.blockID,
        chapterID = _$get.chapterID;
      if (!_.isNil(blockID)) {
        dispatch({
          type: AT.UPDATE_CHAPTER_PATH_AVATAR,
          context: {
            navAction: "enter-block",
            blockID: blockID,
            chapterID: chapterID
          }
        });
      }
    }
  },
  componentDidUpdate: function componentDidUpdate() {
    if (Bundles.getStatus("library") === "done" && !_.get(this.props.libraryChapter, "model") && this.props.user.userID && !this.props.bookTestHash) {
      this.loadLibraryChapters();
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
    var chapterIDs = GradeChapter.getAllChaptersForGrade(this.props.gradeNumber);
    var sectionID = this.props.block.model ? this.props.block.model.bookSectionID : null;
    if (sectionID) {
      var chapterID = Number(ChapterSection.getChapterIDFromSectionID(sectionID));
      chapterIDs = [chapterID];
    }
    // T25484
    if (!this.props.user.userID) {
      ErrorUtil.log("E_LOAD_LIBRARY_NO_USER", "PageProblem " + JSON.stringify(this.props.user));
    }
    this.props.dispatch({
      type: AT.LOAD_LIBRARY_CHAPTERS_ANTICIPATED_REQUEST,
      userID: this.props.user.userID,
      chapterIDs: chapterIDs
    });
  },
  loadChapter: function loadChapter() {
    var _this$props2 = this.props,
      chapter = _this$props2.chapter,
      dispatch = _this$props2.dispatch,
      user = _this$props2.user;
    var chapterID = chapter.chapterID;
    if (this.props.demo) {
      dispatch({
        type: AT.LOAD_DEMO_CHAPTER,
        chapterID: chapterID
      });
    } else {
      dispatch({
        type: AT.LOAD_CHAPTER_REQUEST,
        userID: user.userID,
        chapterID: chapterID,
        debugInfo: {
          stack: Error().stack,
          props: this.props
        }
      });
    }
  },
  playBlock: function playBlock() {
    var bookTestHash = this.props.bookTestHash;
    if (bookTestHash) {
      this.props.dispatch({
        type: AT.PLAY_BOOK_TEST_BLOCK_REQUEST,
        bookTestHash: bookTestHash
      });
    } else {
      var isTrophy = this.props.problemIndex === "trophy";
      if (this.props.demo) {
        this.props.dispatch({
          type: AT.PLAY_DEMO_BLOCK,
          blockID: this.props.block.blockID,
          isTrophy: isTrophy
        });
      } else {
        this.props.dispatch({
          type: AT.PLAY_BLOCK_REQUEST,
          blockID: this.props.block.blockID,
          isTrophy: isTrophy,
          setNumber: this.props.setNumber
        });
      }
      // If block has a video set, load the theater block
      if (_.get(this.props.block, "model.videoSetID")) {
        if (this.props.demo) {
          this.props.dispatch({
            type: AT.LOAD_DEMO_THEATER_SET,
            videoSetID: this.props.block.model.videoSetID
          });
        } else {
          this.props.dispatch({
            type: AT.LOAD_THEATER_SET_REQUEST,
            videoSetID: this.props.block.model.videoSetID,
            userID: this.props.user.userID
          });
        }
      }
    }
  },
  renderProblemLoaded: function renderProblemLoaded() {
    var _this$props3 = this.props,
      user = _this$props3.user,
      chapter = _this$props3.chapter,
      block = _this$props3.block,
      result = _this$props3.result,
      problem = _this$props3.problem,
      instructionsViewData = _this$props3.instructionsViewData,
      problemIndex = _this$props3.problemIndex,
      demo = _this$props3.demo,
      gradeNumber = _this$props3.gradeNumber;

    // Allow going to summary for challenge block
    var isOnSummary = result.showSummary && result.isOnFinal || OpsResult.shouldShowSummary(result, problemIndex);
    var isOnOverview = (result.showOverview || result.showTestPart1Decision) && result.isOnFinal;
    if (!result || !Derived.checkResultForProblems(result)) {
      var buttonInfo;
      if (result) {
        buttonInfo = {
          type: "chapter",
          text: "chapter " + (this.props.chapterIndex + 1),
          linkTo: URLMake.forResultSource(result)
        };
      }
      return /*#__PURE__*/React.createElement(ReactPageTrainerError, {
        noProblems: true,
        buttonInfo: buttonInfo
      });
    }
    var showHistory = block.model.hasHistory && !OpsUser.hasKey(user, "trainer stay on last set");
    var engineOrSummary;
    if (isOnSummary) {
      engineOrSummary = /*#__PURE__*/React.createElement(Summary, {
        chapter: chapter,
        block: block,
        result: result,
        userModel: user.model,
        demo: demo,
        theaterSet: this.props.theaterSet
      });
    } else if (isOnOverview) {
      engineOrSummary = /*#__PURE__*/React.createElement(OverviewTest, {
        result: result,
        user: user,
        gradeNumber: gradeNumber,
        showInstructions: this.props.showInstructions && !this.props.errorMessageInfo,
        instructionsViewData: instructionsViewData
      });
    } else {
      var useMiddleInstructions = InstructionsUtil.isMiddleInstructions(block, problem, problemIndex);
      engineOrSummary = /*#__PURE__*/React.createElement(Engine, {
        result: result,
        problem: problem,
        problemIndex: problemIndex,
        instructionsViewData: instructionsViewData,
        showInstructions: this.props.showInstructions && !this.props.errorMessageInfo,
        useMiddleInstructions: useMiddleInstructions,
        hasHistory: showHistory,
        user: user,
        connected: this.props.connected,
        isIdle: this.props.isIdle,
        demo: demo,
        demoTutorialShown: this.props.demoTutorialShown,
        hasVideos: !!_.get(block, "model.videoSetID")
      });
    }
    return engineOrSummary;
  },
  renderProblem: function renderProblem() {
    var _this = this;
    var _this$props4 = this.props,
      chapter = _this$props4.chapter,
      block = _this$props4.block,
      chapterIndex = _this$props4.chapterIndex,
      result = _this$props4.result,
      bookTestHash = _this$props4.bookTestHash;
    var isTrophy = this.props.problemIndex === "trophy";
    var problemType = isTrophy ? "trophy" : "standard";
    var buttonInfo;
    if (result) {
      buttonInfo = {
        type: "chapter",
        text: "chapter " + (chapterIndex + 1),
        linkTo: URLMake.forResultSource(result)
      };
    }
    if (this.state.reactCrashed) {
      return /*#__PURE__*/React.createElement(ReactPageTrainerError, {
        isReactCrash: true,
        problemType: problemType,
        buttonInfo: buttonInfo,
        outOfMemory: this.state.reactCrashOutOfMemory
      });
    }
    var blockLoad = isTrophy ? block.trophy : block;
    var doesNotExist = !bookTestHash && !chapter.chapterID || !block.blockID;
    var chapterLoadErrorView = /*#__PURE__*/React.createElement(ReactPageTrainerError, {
      doesNotExist: doesNotExist,
      problemType: problemType,
      buttonInfo: buttonInfo
    });

    // Second check: is block and result loaded?
    var renderBlockLoadGuard = function renderBlockLoadGuard() {
      var status = blockLoad;
      // For demo, we need to request load if there's no problem index to trigger
      // the logic to find the correct problem.
      if (_this.props.demo && _this.props.problemIndex === undefined && status.load !== "error") {
        status = {
          load: "none"
        };
      }
      var blockLoadError = blockLoad && blockLoad.loadError;
      var unlocksAt = blockLoad && blockLoad.unlocksAt;
      var blockLoadErrorView = /*#__PURE__*/React.createElement(ReactPageTrainerError, {
        doesNotExist: doesNotExist,
        problemType: problemType,
        locked: blockLoadError === "E_LOCKED",
        unlocksAt: unlocksAt,
        buttonInfo: buttonInfo
      });
      return /*#__PURE__*/React.createElement(LoadGuard, {
        identifier: "playBlock" + block.blockID,
        status: status,
        requestLoad: _this.playBlock,
        loadingView: /*#__PURE__*/React.createElement(BlankEngine, {
          withLoading: true
        }),
        errorView: blockLoadErrorView,
        renderLoaded: _this.renderProblemLoaded
      });
    };
    if (bookTestHash) {
      return renderBlockLoadGuard();
    } else {
      // First check: is chapter loaded?
      return /*#__PURE__*/React.createElement(LoadGuard, {
        identifier: "trainerChapter" + chapter.chapterID,
        status: chapter,
        requestLoad: this.loadChapter,
        loadingView: /*#__PURE__*/React.createElement(BlankEngine, {
          withLoading: true
        }),
        errorView: chapterLoadErrorView,
        renderLoaded: renderBlockLoadGuard
      });
    }
  },
  render: function render() {
    var _this$props5 = this.props,
      user = _this$props5.user,
      chapter = _this$props5.chapter,
      block = _this$props5.block,
      result = _this$props5.result,
      libraryChapter = _this$props5.libraryChapter,
      libraryPages = _this$props5.libraryPages,
      libraryContext = _this$props5.libraryContext,
      demo = _this$props5.demo,
      blockType = _this$props5.blockType;
    // T29434 - Problem page is being loaded with null user model, looks like some sort of weird
    // timing issue with the redirect to login
    if (!user.model) {
      ErrorUtil.log("E_USER_MODEL_NULL", "Rendering problem page with null user model");
      return null;
    }
    var devDebug = null;
    if (result && FLAGS.showDebugPanels && !(blockType === "test")) {
      // PROJ-18068: hide DEBUG menu on tests
      devDebug = /*#__PURE__*/React.createElement(DevDebugMenu, {
        setNumber: result.setNumber,
        isGenerated: result.isGenerated,
        resultType: result.resultType,
        problemIndex: this.props.problemIndex,
        devWindowsAreHidden: this.props.devWindowsAreHidden
      });
    }
    var wrapperProps = {
      gradeNumber: this.props.gradeNumber,
      chapterIndex: this.props.chapterIndex,
      blockIndex: this.props.blockIndex,
      blockType: this.props.blockType,
      problemIndex: this.props.problemIndex,
      theaterSet: this.props.theaterSet,
      user: user,
      chapter: chapter,
      libraryChapter: libraryChapter,
      libraryPages: libraryPages,
      libraryContext: libraryContext,
      block: block,
      result: result,
      showBook: this.props.showBook,
      showVideo: this.props.showVideo,
      demo: demo,
      demoTutorialShown: this.props.demoTutorialShown,
      videoIntervention: this.props.videoIntervention
    };
    return /*#__PURE__*/React.createElement(TrainerPageWrapper, wrapperProps, /*#__PURE__*/React.createElement(PortalDestination, {
      name: PORTAL_CONTAINERS.DEMO_TUTORIAL_MODAL
    }), /*#__PURE__*/React.createElement("div", {
      style: FLAGS.cleanMode ? {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        background: FLAG_OPTIONS.cleanMode.appearance.backgroundColor
      } : {}
    }, this.renderProblem()), devDebug);
  }
}));

/***/ },

/***/ "./src/trainer/reactView/SummaryHistory.jsx"
/*!**************************************************!*\
  !*** ./src/trainer/reactView/SummaryHistory.jsx ***!
  \**************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var Moment = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
var withVaultDispatch = __webpack_require__(/*! ../../core/hoc/withVaultDispatch.jsx */ "./src/core/hoc/withVaultDispatch.jsx");
var withSetURL = __webpack_require__(/*! ../../core/hoc/withSetURL.jsx */ "./src/core/hoc/withSetURL.jsx");
var OpsBlock = __webpack_require__(/*! ../../core/vault/OpsBlock.js */ "./src/core/vault/OpsBlock.js");
var OpsUser = __webpack_require__(/*! ../../core/vault/OpsUser.js */ "./src/core/vault/OpsUser.js");
var AT = __webpack_require__(/*! ../../core/vault/ActionTypes.js */ "./src/core/vault/ActionTypes.js");
var BlueButton = __webpack_require__(/*! ../../core/view/BlueButton.jsx */ "./src/core/view/BlueButton.jsx");
var Stars = __webpack_require__(/*! ../../core/view/Stars.jsx */ "./src/core/view/Stars.jsx");
var PartialProgressCircle = __webpack_require__(/*! ../../core/view/PartialProgressCircle.jsx */ "./src/core/view/PartialProgressCircle.jsx");
var StringUtil = __webpack_require__(/*! ../../../shared/StringUtil.js */ "./shared/StringUtil.js");
var MessageModal = __webpack_require__(/*! ../../core/view/MessageModal.jsx */ "./src/core/view/MessageModal.jsx");
var URLMake = __webpack_require__(/*! ../../../shared/URLMake.js */ "./shared/URLMake.js");
var ResultManager = __webpack_require__(/*! ../../../shared/ResultManager.js */ "./shared/ResultManager.js");
var GradeChapter = __webpack_require__(/*! ../../../shared/GradeChapter.js */ "./shared/GradeChapter.js");
var CopyTable = __webpack_require__(/*! ../../core/util/CopyTable.js */ "./src/core/util/CopyTable.js");
var AssetsUtil = __webpack_require__(/*! ../../core/util/AssetsUtil.js */ "./src/core/util/AssetsUtil.js");
var _require = __webpack_require__(/*! ../../core/util/GlobalFlags.js */ "./src/core/util/GlobalFlags.js"),
  FLAGS = _require.FLAGS;
var styles = __webpack_require__(/*! ./styles/SummaryHistory.css */ "./src/trainer/reactView/styles/SummaryHistory.css");

// Helper to apply higher-order components.
var augment = function augment(Component) {
  Component = withSetURL(Component);
  Component = withVaultDispatch(Component);
  return Component;
};
module.exports = augment(createReactClass({
  displayName: "SummaryHistoryView",
  propTypes: {
    userModel: PT.object,
    results: PT.array.isRequired,
    block: PT.object.isRequired,
    chapter: PT.object.isRequired,
    isLastResultBroken: PT.bool,
    demo: PT.bool,
    demoReplayBlockId: PT.number,
    // Injected by HOCs
    dispatch: PT.func.isRequired,
    setURL: PT.func.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      unviewableResultModal: this.props.isLastResultBroken
    };
  },
  handleTestReplay: function handleTestReplay() {
    var block = this.props.block;
    var user = {
      model: this.props.userModel
    };
    if (OpsUser.hasTeacherRole(user) || OpsUser.hasKey(user, "trainer allow unfinished test")) {
      this.props.setURL(URLMake.forBlock(block));
    } else {
      if (OpsBlock.isInTestCooldown(block) && !FLAGS.bypassTestCooldown && !block.model.lockOverride === "unlocked") {
        this.props.dispatch({
          type: AT.SHOW_MESSAGE,
          messageType: "testCooldown",
          data: {
            expiration: block.model.testCooldownExpiration,
            reason: block.model.testCooldownReason,
            user: user
          }
        });
      } else {
        var chapterContext = GradeChapter.chapterIDToContext(this.props.chapter.chapterID);
        this.props.dispatch({
          type: AT.SHOW_CONFIRM,
          messageType: "startTest",
          data: {
            onConfirmDispatch: {
              type: AT.START_TEST,
              block: block
            },
            baLevel: chapterContext.gradeNumber,
            chapter: chapterContext.chapterIndex + 1,
            chapterName: chapterContext.name
          }
        });
      }
    }
  },
  handleDemoReplay: function handleDemoReplay() {
    if (!this.props.demoReplayBlockId) {
      this.props.dispatch({
        type: AT.ATTEMPT_REPLAY_DEMO_LESSON,
        blockID: this.props.block.blockID
      });
    } else {
      // restart demo block
      this.props.dispatch({
        type: AT.REPLAY_DEMO_BLOCK,
        blockID: this.props.block.blockID
      });
    }
  },
  renderNavButtons: function renderNavButtons() {
    var _this$props = this.props,
      block = _this$props.block,
      chapter = _this$props.chapter,
      results = _this$props.results,
      demo = _this$props.demo;
    var user = {
      model: this.props.userModel
    };
    var blockModel = _.get(block, "model");
    var defaultButtonProps = {
      className: styles.blueButton
    };

    //Display a Play Again and a Chapter ? button
    var chapterName = "Chapter " + (chapter.model.chapterIndex + 1);
    var buttonType = results.length > 0 ? "replay" : "getstarted";
    var replayButtonProps;
    if (demo) {
      replayButtonProps = {
        handleClick: this.handleDemoReplay
      };
    } else if (block.model.blockType === "test") {
      replayButtonProps = {
        handleClick: this.handleTestReplay
      };
    } else {
      replayButtonProps = {
        linkTo: URLMake.forBlock(block)
      };
    }
    var manuallyLocked = blockModel.lockOverride === "locked";
    var inCooldown = !blockModel.ignoreCooldown && OpsBlock.isInTestCooldown(block);
    var replayButton = manuallyLocked || inCooldown || OpsUser.hasTeacherRole(user) || OpsUser.hasKey(user, "trainer allow unfinished test") ? null : /*#__PURE__*/React.createElement(BlueButton, _extends({
      buttonType: buttonType
    }, replayButtonProps, defaultButtonProps));
    var chapterButton = demo ? null : /*#__PURE__*/React.createElement(BlueButton, _extends({
      buttonText: chapterName,
      linkTo: URLMake.forChapter(chapter),
      buttonType: "chapter"
    }, defaultButtonProps));
    return /*#__PURE__*/React.createElement("div", {
      className: styles.navButtons
    }, replayButton, chapterButton);
  },
  renderContents: function renderContents() {
    return this.renderHistory();
  },
  renderRow: function renderRow(res) {
    var resultSettings = ResultManager(res);
    var isGame = resultSettings.neverResumeResult;
    var date;
    if (isGame) {
      date = Moment(res.updatedAt).format("MMMM D, YYYY");
    } else if (res.finishedAt) {
      date = Moment(res.finishedAt).format("MMMM D, YYYY");
    }
    var timePlayed = StringUtil.toTimeString(Math.ceil(res.timeSpent / 60));
    var xp = (res.xpEarned || 0) + " XP";
    var starsCol;
    if (res.hasIntervened || res.hasQuit && res.resultType === "test") {
      starsCol = /*#__PURE__*/React.createElement("div", {
        className: styles.iconOuter
      }, /*#__PURE__*/React.createElement("img", {
        className: styles.icon,
        src: globalThis.BASE_URL + "assets/images/icons/intervention.svg"
      }));
    } else if (isGame && !this.getStars(res)) {
      starsCol = /*#__PURE__*/React.createElement("div", {
        className: styles.iconOuter
      }, /*#__PURE__*/React.createElement(PartialProgressCircle, {
        className: styles.icon,
        percentComplete: res.percentComplete,
        opaque: true
      }));
    } else {
      starsCol = /*#__PURE__*/React.createElement(Stars, {
        numStars: this.getStars(res),
        mainClass: styles.stars,
        starClass: styles.star
      });
    }
    var xpCol = this.props.demo ? null : /*#__PURE__*/React.createElement("td", {
      className: styles.xp
    }, xp);
    var timeCol = this.props.demo ? null : /*#__PURE__*/React.createElement("td", {
      className: styles.time
    }, timePlayed);
    var key = "result" + (this.props.demo ? res.finishedAt : res.resultID);
    return /*#__PURE__*/React.createElement("tr", {
      key: key,
      className: styles.row
    }, /*#__PURE__*/React.createElement("td", {
      className: styles.spacer
    }), /*#__PURE__*/React.createElement("td", {
      className: styles.date
    }, date), /*#__PURE__*/React.createElement("td", {
      className: styles.starsCol
    }, starsCol), xpCol, timeCol);
  },
  renderHistory: function renderHistory(type) {
    var results = this.props.results;
    var recentResult = results[0];
    var historyResults = _.tail(results);
    var maxToShow = 5; //We can change this if we want.
    var more = Math.max(0, historyResults.length - maxToShow);
    historyResults = _.take(historyResults, maxToShow);
    var historyRows = _.isEmpty(historyResults) ? /*#__PURE__*/React.createElement("tr", {
      className: styles.rowText
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 5
    }, "No other history for this lesson.")) : historyResults.map(this.renderRow);
    var moreRow = null;
    if (more) {
      moreRow = /*#__PURE__*/React.createElement("tr", {
        className: styles.rowText
      }, /*#__PURE__*/React.createElement("td", {
        colSpan: 5
      }, "+" + more + " more"));
    }
    var recentResultEl = recentResult ? /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", {
      className: styles.heading
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 5
    }, "Your most recent play:")), this.renderRow(recentResult)) : null;
    return /*#__PURE__*/React.createElement("div", {
      className: styles.contentInner
    }, /*#__PURE__*/React.createElement("table", {
      className: styles.tables
    }, recentResultEl), /*#__PURE__*/React.createElement("table", {
      className: styles.tables
    }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", {
      className: styles.heading
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 5
    }, "Lesson history:")), historyRows, moreRow)));
  },
  getStars: function getStars(res) {
    var _ResultManager = ResultManager(res),
      canEarnStarsOnTrialSubmission = _ResultManager.canEarnStarsOnTrialSubmission,
      canEarnStarsOnStateChange = _ResultManager.canEarnStarsOnStateChange;
    return canEarnStarsOnTrialSubmission || canEarnStarsOnStateChange ? res.starsEarnedSoFar : res.starsObtained;
  },
  closeModal: function closeModal() {
    this.setState({
      unviewableResultModal: false
    });
  },
  render: function render() {
    var _this = this;
    var results = this.props.results;
    var mostStars = _.reduce(results, function (most, r) {
      var stars = _this.getStars(r);
      return Math.max(stars, most);
    }, 0);
    var navButtons = this.renderNavButtons();
    var outerClass = styles.outerLarge;
    var noViewableModal = this.state.unviewableResultModal ? /*#__PURE__*/React.createElement(MessageModal, {
      styleType: _.get(results[0], "styleType", "default"),
      size: "medium",
      onClose: this.closeModal,
      buttonText: "okay",
      buttonClickHandler: this.closeModal
    }, CopyTable.forNoViewableHistoryResult()) : null;
    return /*#__PURE__*/React.createElement("div", {
      className: styles.main
    }, /*#__PURE__*/React.createElement("div", {
      className: styles.summary
    }, /*#__PURE__*/React.createElement("img", {
      className: styles.bg,
      src: AssetsUtil.getSummaryRect(mostStars)
    }), /*#__PURE__*/React.createElement("div", {
      className: outerClass
    }, /*#__PURE__*/React.createElement("img", {
      className: styles.bg,
      src: AssetsUtil.getSummaryRect("results")
    }), /*#__PURE__*/React.createElement("div", {
      className: styles.content
    }, this.renderContents()))), navButtons, noViewableModal);
  }
}));

/***/ },

/***/ "./src/trainer/reactView/TrainerJazz.jsx"
/*!***********************************************!*\
  !*** ./src/trainer/reactView/TrainerJazz.jsx ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

/* Decorations on the trainer page for each character */

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var styles = __webpack_require__(/*! ./styles/TrainerJazz.css */ "./src/trainer/reactView/styles/TrainerJazz.css");
var _require = __webpack_require__(/*! ../../core/util/GlobalFlags.js */ "./src/core/util/GlobalFlags.js"),
  FLAGS = _require.FLAGS;

// For some reason, eslint-react gets confused by the nested methods.
/* eslint-disable react/no-multi-comp */

module.exports = createReactClass({
  displayName: "TrainerJazz",
  propTypes: {
    position: PT.oneOf(["over", "under"]).isRequired,
    styleType: PT.string,
    isOnSummary: PT.bool,
    // Available options: skipCrabJazz, skipRopeJazz.
    options: PT.object
  },
  // keyed by styleType + "_" + position, with summary_ in front if isOnSummary
  // abbreviation examples: tmr = top middle right, bl = bottom left
  // is true.
  jazzMethods: {
    /***********
     * KRAKEN
     ***********/
    kraken_under: function kraken_under() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/kraken/jazz/play-rmb-under.svg",
        className: styles.rmbKraken
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/kraken/jazz/play-tmr-under.svg",
        className: styles.tmrKraken
      }));
    },
    kraken_over: function kraken_over(jazzOptions) {
      var bmr = /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/kraken/jazz/play-bmr-over.svg",
        className: styles.bmrKraken
      });
      var bl = /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/kraken/jazz/play-bl-over.svg",
        className: styles.blKraken
      });
      if (jazzOptions.skipCrabJazz) {
        bmr = null;
        bl = null;
      }
      return /*#__PURE__*/React.createElement("div", null, bl, bmr, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/kraken/jazz/play-br-over.svg",
        className: styles.brKraken
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/kraken/jazz/play-tl-over.svg",
        className: styles.tlKraken
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/kraken/jazz/play-rmt-over.svg",
        className: styles.rmtKraken
      }));
    },
    /**********
     * MS. Q
     **********/
    q_under: function q_under() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/q/jazz/play-rmb-under.svg",
        className: styles.rmbQ
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/q/jazz/play-lmb-under.svg",
        className: styles.lmbQ
      }));
    },
    q_over: function q_over() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/q/jazz/play-bl-over.svg",
        className: styles.blQ
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/q/jazz/play-br-over.svg",
        className: styles.brQ
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/q/jazz/play-tl-over.svg",
        className: styles.tlQ
      }));
    },
    /**********
     * FIONA
     **********/
    fiona_under: function fiona_under() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/fiona/jazz/play-rmb-under.svg",
        className: styles.rmbFiona
      }));
    },
    fiona_over: function fiona_over() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/fiona/jazz/play-bl-over.svg",
        className: styles.blFiona
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/fiona/jazz/play-tl-over.svg",
        className: styles.tlFiona
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/fiona/jazz/play-br-over.svg",
        className: styles.brFiona
      }));
    },
    /*********
     * GROK
     *********/
    grok_under: function grok_under() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/grok/jazz/play-rmb-under.svg",
        className: styles.rmbGrok
      }));
    },
    grok_over: function grok_over() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/grok/jazz/play-bl-over.svg",
        className: styles.blGrok
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/grok/jazz/play-tl-over.svg",
        className: styles.tlGrok
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/grok/jazz/play-br-over.svg",
        className: styles.brGrok
      }));
    },
    /*********
     * ROTE
     *********/
    rote_under: function rote_under() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/rote/jazz/play-rmb-under.svg",
        className: styles.rmbRote
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/rote/jazz/play-lmb-under.svg",
        className: styles.lmbRote
      }));
    },
    rote_over: function rote_over(jazzOptions) {
      var tlOver;
      if (jazzOptions.skipRopeJazz) {
        tlOver = null;
      } else {
        tlOver = /*#__PURE__*/React.createElement("img", {
          src: globalThis.BASE_URL + "assets/images/themes/rote/jazz/play-tl-over.svg",
          className: styles.tlRote
        });
      }
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/rote/jazz/play-bl-over.svg",
        className: styles.blRote
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/rote/jazz/play-bmr-over.svg",
        className: styles.bmrRote
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/rote/jazz/play-br-over.svg",
        className: styles.brRote
      }), tlOver, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/rote/jazz/play-tr-over.svg",
        className: styles.trRote
      }));
    },
    /**
     * MS_LEVANS
     */
    ms_levans_under: function ms_levans_under() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/ms_levans/jazz/play-bmr-under.svg",
        className: styles.bmrLevans
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/ms_levans/jazz/play-lmb-under.svg",
        className: styles.lmbLevans
      }));
    },
    ms_levans_over: function ms_levans_over() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/ms_levans/jazz/play-tl-over.svg",
        className: styles.tlLevans
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/ms_levans/jazz/play-bl-over.svg",
        className: styles.blLevans
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/ms_levans/jazz/play-br-over.svg",
        className: styles.brLevans
      }));
    },
    /*********
     * TEST
     *********/
    test_under: function test_under() {
      return;
    },
    /* eslint-disable-next-line */test_over: function test_over(_ref) {
      var gradeNumber = _ref.gradeNumber;
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/test/jazz/play-bl-over-grade".concat(gradeNumber, ".svg"),
        className: styles.blTest
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/test/jazz/play-br-over-grade".concat(gradeNumber, ".svg"),
        className: styles.brTest
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/test/jazz/play-tl-over-grade".concat(gradeNumber, ".svg"),
        className: styles.tlTest
      }));
    },
    // summary_test_over() {
    //   return (
    //     <div>
    //       <img src={global.BASE_URL + "assets/images/summary/test/tl-over.svg"} className={styles.tlSummaryTest}/>
    //       <img src={global.BASE_URL + "assets/images/summary/test/tr-over.svg"} className={styles.trSummaryTest}/>
    //     </div>
    //   );
    // },
    /**************
     * CHALLENGE
     ***************/
    challenge_under: function challenge_under() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/challenge/jazz/play-rmb-under.svg",
        className: styles.rmbChallenge
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/challenge/jazz/play-lmb-under.svg",
        className: styles.lmbChallenge
      }));
    },
    challenge_over: function challenge_over() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/challenge/jazz/play-bl-over.svg",
        className: styles.blChallenge
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/challenge/jazz/play-tr-over.svg",
        className: styles.trChallenge
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/challenge/jazz/play-br-over.svg",
        className: styles.brChallenge
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/challenge/jazz/play-tl-over.svg",
        className: styles.tlChallenge
      }));
    },
    /*****************
     * REVIEW - R&G
     *****************/
    review_under: function review_under() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/review/jazz/play-rmb-under.svg",
        className: styles.rmbReview
      }));
    },
    review_over: function review_over() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/review/jazz/play-bl-over.svg",
        className: styles.blReview
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/review/jazz/play-tr-over.svg",
        className: styles.trReview
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/review/jazz/play-br-over.svg",
        className: styles.brReview
      }), /*#__PURE__*/React.createElement("img", {
        src: globalThis.BASE_URL + "assets/images/themes/review/jazz/play-tl-over.svg",
        className: styles.tlReview
      }));
    }
  },
  render: function render() {
    if (FLAGS.cleanMode) {
      return null;
    }
    var key = this.props.styleType + "_" + this.props.position;
    if (this.props.isOnSummary) {
      key = "summary_" + key;
    }
    var renderedJazz;
    if (this.jazzMethods[key]) {
      renderedJazz = this.jazzMethods[key](this.props.options || {});
    }
    return renderedJazz || null;
  }
});

/* eslint-enable react/no-multi-comp */

/***/ },

/***/ "./src/trainer/reactView/TrainerPageWrapper.jsx"
/*!******************************************************!*\
  !*** ./src/trainer/reactView/TrainerPageWrapper.jsx ***!
  \******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var PT = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var createReactClass = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
var _require = __webpack_require__(/*! ../../../shared/PortalConstants.ts */ "./shared/PortalConstants.ts"),
  PORTAL_CONTAINERS = _require.PORTAL_CONTAINERS;
var _require2 = __webpack_require__(/*! ../../core/view/PortalDestination.tsx */ "./src/core/view/PortalDestination.tsx"),
  PortalDestination = _require2.PortalDestination;
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var GradeChapter = __webpack_require__(/*! ../../../shared/GradeChapter.js */ "./shared/GradeChapter.js");
var OpsUser = __webpack_require__(/*! ../../core/vault/OpsUser.js */ "./src/core/vault/OpsUser.js");
var BlockStyle = __webpack_require__(/*! ../../core/vault/BlockStyle.js */ "./src/core/vault/BlockStyle.js");
var DrawingUtil = __webpack_require__(/*! ../../core/util/DrawingUtil.js */ "./src/core/util/DrawingUtil.js");
var TopBar = __webpack_require__(/*! ../../core/view/TopBar.jsx */ "./src/core/view/TopBar.jsx");
var MeasuredEl = __webpack_require__(/*! ../../core/view/MeasuredEl.jsx */ "./src/core/view/MeasuredEl.jsx");
var CanvasView = __webpack_require__(/*! ../../core/view/Canvas.jsx */ "./src/core/view/Canvas.jsx");
var ChapterBar = __webpack_require__(/*! ../../core/view/ChapterBar.jsx */ "./src/core/view/ChapterBar.jsx");
var TrainerJazz = __webpack_require__(/*! ./TrainerJazz.jsx */ "./src/trainer/reactView/TrainerJazz.jsx");
var _require3 = __webpack_require__(/*! ./SetProgress */ "./src/trainer/reactView/SetProgress.tsx"),
  SetProgress = _require3.SetProgress;
var StarProgress = __webpack_require__(/*! ./StarProgress.jsx */ "./src/trainer/reactView/StarProgress.jsx");
var GeneralPageWrapper = __webpack_require__(/*! ../../core/view/GeneralPageWrapper.jsx */ "./src/core/view/GeneralPageWrapper.jsx");
var _require4 = __webpack_require__(/*! ../../core/util/GlobalFlags.js */ "./src/core/util/GlobalFlags.js"),
  FLAGS = _require4.FLAGS,
  FLAG_OPTIONS = _require4.FLAG_OPTIONS;
var EngineUtil = __webpack_require__(/*! ../EngineCreator.js */ "./src/trainer/EngineCreator.js");
var specialResultTypes = (__webpack_require__(/*! ../../../shared/data/engines.json */ "./shared/data/engines.json").specialResultTypes);
var styles = __webpack_require__(/*! ./styles/TrainerPageWrapper.css */ "./src/trainer/reactView/styles/TrainerPageWrapper.css");
module.exports = createReactClass({
  displayName: "TrainerPageWrapper",
  propTypes: {
    gradeNumber: PT.number.isRequired,
    chapterIndex: PT.number,
    blockIndex: PT.number,
    blockType: PT.string,
    problemIndex: PT.any,
    isHistoryPage: PT.bool,
    hideSetProgress: PT.bool,
    user: PT.object.isRequired,
    chapter: PT.object,
    block: PT.object,
    theaterSet: PT.object,
    result: PT.object,
    libraryChapter: PT.object,
    libraryPages: PT.object,
    libraryContext: PT.object,
    demo: PT.bool,
    demoTutorialShown: PT.string,
    leftNavURL: PT.string,
    rightNavURL: PT.string,
    leftNavTooltip: PT.string,
    rightNavTooltip: PT.string,
    navTooltipProps: PT.object,
    showBook: PT.bool,
    showBookSectionID: PT.number,
    showTheaterToLessonModal: PT.bool,
    showVideo: PT.bool,
    videoIntervention: PT.bool
  },
  getValidGradeNumber: function getValidGradeNumber() {
    if (GradeChapter.isActiveGrade(this.props.gradeNumber, true)) {
      return this.props.gradeNumber;
    } else {
      return OpsUser.getMostRecentPageData(this.props.user).gradeNumber;
    }
  },
  renderBackgroundBottom: function renderBackgroundBottom(styleType) {
    var bgBottom = null;
    if (styleType) {
      var src = globalThis.BASE_URL + "assets/images/themes/" + styleType + "/bgbottom.svg";
      bgBottom = /*#__PURE__*/React.createElement("img", {
        className: styles.engine,
        src: src
      });
    }
    return bgBottom;
  },
  render: function render() {
    var _this$props = this.props,
      user = _this$props.user,
      _this$props$chapter = _this$props.chapter,
      chapter = _this$props$chapter === void 0 ? {} : _this$props$chapter,
      block = _this$props.block,
      result = _this$props.result;
    var _this$props2 = this.props,
      gradeNumber = _this$props2.gradeNumber,
      chapterIndex = _this$props2.chapterIndex,
      blockIndex = _this$props2.blockIndex,
      blockType = _this$props2.blockType,
      problemIndex = _this$props2.problemIndex,
      demo = _this$props2.demo;
    var _this$props3 = this.props,
      isHistoryPage = _this$props3.isHistoryPage,
      hideSetProgress = _this$props3.hideSetProgress;
    var isProblemPage = _.get(result, "resultType") === "bookTest" || chapter.chapterID && !!block;
    var blockStyleProps = {
      result: result,
      block: block,
      blockType: blockType,
      gradeNumber: gradeNumber,
      chapterIndex: chapterIndex,
      blockIndex: blockIndex
    };
    var styleType = BlockStyle.getType(blockStyleProps);
    var styleColor = BlockStyle.getColor(blockStyleProps);
    if (!gradeNumber && demo) styleColor = "demo";

    /* Trainer chapter pages all have same (non-argyle) background color
       while loading. Does not apply to problem/history pages in trainer. */
    if (!isProblemPage && !isHistoryPage) {
      styleColor = "trainerchapter";
    }
    var isOnSummary = result && result.showSummary && problemIndex === "summary" || isHistoryPage;

    // TODO: Make this less sad
    var specialRendererID = result && specialResultTypes[result.resultType];
    var engineSettings = specialRendererID ? EngineUtil.getEngineSettings(specialRendererID) : {};
    engineSettings.gradeNumber = gradeNumber;
    var setProgress = null;
    if (block && result && !hideSetProgress) {
      setProgress = /*#__PURE__*/React.createElement(SetProgress, {
        result: result,
        blockModel: block.model,
        problemIndex: problemIndex,
        user: user,
        isProblemHistory: isHistoryPage,
        style: FLAGS.cleanMode ? {
          visibility: "visible"
        } : {}
      });
    }
    var topBarYellowEl;
    if (isProblemPage) {
      if (result) {
        topBarYellowEl = /*#__PURE__*/React.createElement(StarProgress, {
          result: result,
          user: user
        });
      } else {
        //temp yellow bar while loading
        topBarYellowEl = /*#__PURE__*/React.createElement(MeasuredEl, {
          className: styles.level
        }, /*#__PURE__*/React.createElement(CanvasView, {
          draw: function draw(context, opts) {
            return DrawingUtil.drawTopBarYellow(context);
          }
        }));
      }
    }
    var problemPageType = "normal";
    if (hideSetProgress) {
      problemPageType = "history";
    } else if (problemIndex === "trophy") {
      problemPageType = "trophy";
    }
    var generalPageWrapperProps = _.pick(this.props, ["gradeNumber", "leftNavURL", "rightNavURL", "leftNavTooltip", "rightNavTooltip", "demo"]);
    _.extend(generalPageWrapperProps, {
      tooltipProps: this.props.navTooltipProps,
      styleColor: styleColor
    });
    return /*#__PURE__*/React.createElement(GeneralPageWrapper, generalPageWrapperProps, this.renderBackgroundBottom(styleType), /*#__PURE__*/React.createElement("div", {
      className: styles.top,
      style: FLAGS.cleanMode ? {
        visibility: "hidden"
      } : {}
    }, /*#__PURE__*/React.createElement(ChapterBar, {
      gradeNumber: this.getValidGradeNumber(),
      chapterIndex: chapterIndex,
      styleColor: styleColor,
      chapterModel: chapter.model,
      blockModel: block && block.model,
      theaterSet: this.props.theaterSet,
      isForBlock: isProblemPage,
      showBook: this.props.showBook,
      showBookSectionID: this.props.showBookSectionID,
      showTheaterToLessonModal: this.props.showTheaterToLessonModal,
      showVideo: this.props.showVideo,
      libraryChapter: this.props.libraryChapter,
      libraryPages: this.props.libraryPages,
      libraryContext: this.props.libraryContext,
      user: user,
      problemPageType: problemPageType,
      demo: this.props.demo,
      demoTutorialShown: this.props.demoTutorialShown,
      videoIntervention: this.props.videoIntervention
    }), /*#__PURE__*/React.createElement(TopBar, {
      barEl: topBarYellowEl,
      user: user,
      isProblemPage: isProblemPage,
      demo: this.props.demo
    }), setProgress), /*#__PURE__*/React.createElement(TrainerJazz, {
      position: "under",
      styleType: styleType,
      isOnSummary: isOnSummary,
      options: engineSettings
    }), this.props.children, /*#__PURE__*/React.createElement(TrainerJazz, {
      position: "over",
      styleType: styleType,
      isOnSummary: isOnSummary,
      options: engineSettings
    }), !FLAGS.cleanMode && /*#__PURE__*/React.createElement(PortalDestination, {
      name: PORTAL_CONTAINERS.TOOLTRAYS_RIGHT
    }), !(FLAGS.cleanMode && FLAG_OPTIONS.cleanMode.misc.hideDrawTools) && /*#__PURE__*/React.createElement(PortalDestination, {
      name: PORTAL_CONTAINERS.TOOLTRAYS_LEFT
    }), /*#__PURE__*/React.createElement(PortalDestination, {
      name: PORTAL_CONTAINERS.INSTRUCTIONS_MODAL
    }), /*#__PURE__*/React.createElement(PortalDestination, {
      name: PORTAL_CONTAINERS.SOLUTION_KEYBOARD
    }));
  }
});

/***/ },

/***/ "./src/trainer/vault/UpdateTrainer.js"
/*!********************************************!*\
  !*** ./src/trainer/vault/UpdateTrainer.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _actionHandlers;
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var _ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
var moment = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
var AT = __webpack_require__(/*! ../../core/vault/ActionTypes.js */ "./src/core/vault/ActionTypes.js");
var ErrorUtil = __webpack_require__(/*! ../../../shared/ErrorUtil.js */ "./shared/ErrorUtil.js");
var _require = __webpack_require__(/*! ../../../shared/ImmHelpers.js */ "./shared/ImmHelpers.js"),
  setIn = _require.setIn,
  extendIn = _require.extendIn;
var _require2 = __webpack_require__(/*! ../../core/vault/StateCursors.js */ "./src/core/vault/StateCursors.js"),
  atChapterPath = _require2.atChapterPath,
  atTutorial = _require2.atTutorial,
  atTutorialBlock = _require2.atTutorialBlock,
  atTutorialCurrentPartName = _require2.atTutorialCurrentPartName,
  atTutorialCurrentStepName = _require2.atTutorialCurrentStepName,
  atDemo = _require2.atDemo,
  atDemoData = _require2.atDemoData,
  atPage = _require2.atPage,
  atPageUser = _require2.atPageUser,
  atUser = _require2.atUser,
  atTempUser = _require2.atTempUser,
  atChapter = _require2.atChapter,
  atChapterByPage = _require2.atChapterByPage,
  atCurrChapter = _require2.atCurrChapter,
  atChapters = _require2.atChapters,
  atBlocks = _require2.atBlocks,
  atBlockByResultSource = _require2.atBlockByResultSource,
  atBlock = _require2.atBlock,
  atMiscBlock = _require2.atMiscBlock,
  atLabBlock = _require2.atLabBlock,
  atLabBlocks = _require2.atLabBlocks,
  atLabTypeByBlockID = _require2.atLabTypeByBlockID,
  atChapterByBlockID = _require2.atChapterByBlockID,
  atLabType = _require2.atLabType,
  atLabTypes = _require2.atLabTypes,
  atAllLabTypes = _require2.atAllLabTypes,
  atTheaterSet = _require2.atTheaterSet,
  atBlockByPage = _require2.atBlockByPage,
  atCurrBlock = _require2.atCurrBlock,
  atCurrLabBlock = _require2.atCurrLabBlock,
  atResultBySource = _require2.atResultBySource,
  atResultByPage = _require2.atResultByPage,
  atCurrResult = _require2.atCurrResult,
  atCurrProblem = _require2.atCurrProblem,
  atDevProblem = _require2.atDevProblem,
  atTutorialProblemsWorkedOn = _require2.atTutorialProblemsWorkedOn;
var Derived = __webpack_require__(/*! ../../core/vault/Derived.js */ "./src/core/vault/Derived.js");
var Slots = __webpack_require__(/*! ../../core/vault/Slots.js */ "./src/core/vault/Slots.js");
var APIFormat = __webpack_require__(/*! ../../core/vault/util/APIFormat.js */ "./src/core/vault/util/APIFormat.js");
var LoadState = __webpack_require__(/*! ../../core/vault/util/LoadState.js */ "./src/core/vault/util/LoadState.js");
var OpsPage = __webpack_require__(/*! ../../core/vault/OpsPage.js */ "./src/core/vault/OpsPage.js");
var TrainerPage = __webpack_require__(/*! ./TrainerPage.js */ "./src/trainer/vault/TrainerPage.js");
var OpsUser = __webpack_require__(/*! ../../core/vault/OpsUser.js */ "./src/core/vault/OpsUser.js");
var OpsBlock = __webpack_require__(/*! ../../core/vault/OpsBlock.js */ "./src/core/vault/OpsBlock.js");
var OpsChapterPath = __webpack_require__(/*! ../../core/vault/OpsChapterPath.js */ "./src/core/vault/OpsChapterPath.js");
var OpsResult = __webpack_require__(/*! ./OpsResult.js */ "./src/trainer/vault/OpsResult.js");
var OpsProblem = __webpack_require__(/*! ./OpsProblem.js */ "./src/trainer/vault/OpsProblem.js");
var OpsDevProblem = __webpack_require__(/*! ./OpsDevProblem.js */ "./src/trainer/vault/OpsDevProblem.js");
var ResultSync = __webpack_require__(/*! ./ResultSync.js */ "./src/trainer/vault/ResultSync.js");
var OpsShared = __webpack_require__(/*! ../../core/vault/OpsShared.js */ "./src/core/vault/OpsShared.js");
var InstructionsUtil = __webpack_require__(/*! ../util/InstructionsUtil.js */ "./src/trainer/util/InstructionsUtil.js");
var ResultBanvas = __webpack_require__(/*! ../util/LegacyResultBanvas.js */ "./src/trainer/util/LegacyResultBanvas.js");
var EngineCreator = __webpack_require__(/*! ../EngineCreator.js */ "./src/trainer/EngineCreator.js");
var ResultManager = __webpack_require__(/*! ../../../shared/ResultManager.js */ "./shared/ResultManager.js");
var TrainerCore = __webpack_require__(/*! ../../../shared/TrainerCore.js */ "./shared/TrainerCore.js");
var TimeFormat = __webpack_require__(/*! ../../../shared/TimeFormat.js */ "./shared/TimeFormat.js");
var GradeChapter = __webpack_require__(/*! ../../../shared/GradeChapter.js */ "./shared/GradeChapter.js");
var URLMake = __webpack_require__(/*! ../../../shared/URLMake.js */ "./shared/URLMake.js");
var Constants = __webpack_require__(/*! ../../../shared/Constants.js */ "./shared/Constants.js");
var _require3 = __webpack_require__(/*! ../../../shared/PageShared.js */ "./shared/PageShared.js"),
  isDevProblemPage = _require3.isDevProblemPage;
var _require4 = __webpack_require__(/*! ../../core/util/GlobalFlags.js */ "./src/core/util/GlobalFlags.js"),
  FLAGS = _require4.FLAGS,
  FLAG_OPTIONS = _require4.FLAG_OPTIONS;
var Mixpanel = __webpack_require__(/*! ../../core/util/Mixpanel.js */ "./src/core/util/Mixpanel.js");
var _require5 = __webpack_require__(/*! ../../../shared/events/trainerActivity.js */ "./shared/events/trainerActivity.js"),
  TRAINER_ACTIVITY_EVENTS = _require5.TRAINER_ACTIVITY_EVENTS;

//
// Helpers for the action handlers
//

var clearProfileAndHomeworkForSelf = function clearProfileAndHomeworkForSelf(state, clock) {
  var userID = atUser(state).getIn("userID");
  return Slots.loadRestartMany(state, [Slots.table.profile(userID), Slots.table.profileActivity(userID, clock.now()), Slots.table.profileActivityDay(userID, clock.now()), Slots.table.homework(userID)]);
};

// Clear block history so it can reload with new results
var clearBlockHistory = function clearBlockHistory(state) {
  return atCurrBlock(state).setIn("history", function (oldValue) {
    return LoadState.loadRestart({});
  });
};

// Clear loading for specific chapters.
var loadRestartChapters = function loadRestartChapters(state, chapterIDs) {
  if (!chapterIDs || !chapterIDs.length) return state;
  chapterIDs.forEach(function (chID) {
    var chapterCR = atChapter(state, chID);
    if (chapterCR.getIn("load") === "done") {
      state = chapterCR.set(function (c) {
        return LoadState.loadRestart(c);
      });
    }
  });
  return state;
};

// Clear all chapter loading. Done after a lock desync detected.
var loadRestartAllChapters = function loadRestartAllChapters(state) {
  var chapterIDs = GradeChapter.getAllActiveChapters();
  return loadRestartChapters(state, chapterIDs);
};

// Returns an object mapping chapter IDs to updates to their models.
var doUnlockingAcrossChapters = function doUnlockingAcrossChapters(state, unlockData) {
  var chapter = unlockData.chapter,
    newChapterBlocksWithStars = unlockData.newChapterBlocksWithStars,
    newTestStars = unlockData.newTestStars,
    newTestTimesCompleted = unlockData.newTestTimesCompleted;
  var grade = chapter.gradeNumber;
  var chapterNumber = chapter.chapterIndex + 1;

  // Only unlock new chapters if we have information about next chapter
  var nextChapterID = GradeChapter.getNextChapterID(grade, chapterNumber);
  if (!nextChapterID) return {};
  var nextChapter = atChapter(state, nextChapterID).getIn("model");
  if (!nextChapter) return {};

  // Checks done; we can do unlocking.

  var unlockInfo = {
    grade: grade,
    chapterNumber: chapterNumber,
    blocksWithStars: newChapterBlocksWithStars,
    testStars: newTestStars,
    testTimesCompleted: newTestTimesCompleted
  };

  // Return value
  var newChaptersData = {};

  // Helpers for modifying newChaptersData
  var setChapterUnlocked = function setChapterUnlocked(chapterObj) {
    if (chapterObj.lockType !== "override") {
      var chapterID = chapterObj.chapterID;
      newChaptersData[chapterID] = _.extend(newChaptersData[chapterID] || {}, {
        unlocked: true
      });
    }
  };
  var setGradeUnlocked = function setGradeUnlocked(firstChapterObj) {
    if (firstChapterObj.gradeLockType !== "override") {
      var chaptersInGrade = GradeChapter.getAllChaptersForGrade(firstChapterObj.gradeNumber);
      _.forEach(chaptersInGrade, function (chID) {
        newChaptersData[chID] = _.extend(newChaptersData[chID] || {}, {
          gradeUnlocked: true
        });
      });
    }
  };
  if (TrainerCore.unlockNextChapter(unlockInfo)) {
    setChapterUnlocked(chapter);
    setChapterUnlocked(nextChapter);
  }
  if (TrainerCore.unlockNextGrade(unlockInfo)) {
    setChapterUnlocked(chapter);
    setChapterUnlocked(nextChapter);
    setGradeUnlocked(nextChapter);
  }
  return newChaptersData;
};

// Given a return of doUnlockingAcrossChapters, return an array of chapter IDs
// that should be reloaded.
var getChaptersToReloadForUnlocking = function getChaptersToReloadForUnlocking(newChaptersData) {
  var minGradeUnlocked = 0;
  var chapterIDsUnlocked = [];
  _.each(newChaptersData, function (data, cid) {
    cid = parseInt(cid);
    var gradeID = GradeChapter.chapterIDToGradeID(cid);
    if (data.gradeUnlocked) {
      minGradeUnlocked = Math.min(minGradeUnlocked || gradeID, gradeID);
    }
    if (data.unlocked) {
      chapterIDsUnlocked.push(cid);
    }
  });
  if (minGradeUnlocked) {
    // If a grade was unlocked, it could cause a chain reaction, so reload
    // everything from that point forward.
    var gradesToReset = GradeChapter.getAllGrades().filter(function (g) {
      return g >= minGradeUnlocked;
    });
    chapterIDsUnlocked.push.apply(chapterIDsUnlocked, _toConsumableArray(_.flatMap(gradesToReset, GradeChapter.getAllChaptersForGrade)));
  }
  return _.uniq(chapterIDsUnlocked);
};

// Returns an object mapping block IDs to updates to their models.
var doUnlockingWithinChapter = function doUnlockingWithinChapter(state, unlockData) {
  var block = unlockData.block,
    chapter = unlockData.chapter,
    newChapterBlocksWithStars = unlockData.newChapterBlocksWithStars,
    newTestStars = unlockData.newTestStars,
    _unlockData$useCurren = unlockData.useCurrentValues,
    useCurrentValues = _unlockData$useCurren === void 0 ? false : _unlockData$useCurren;
  var finalChapterBlocksWithStars = newChapterBlocksWithStars;
  var finalTestStars = newTestStars;
  var newBlockStars = unlockData.newBlockStars;
  if (useCurrentValues) {
    finalChapterBlocksWithStars = chapter.blocksWithStars;
    finalTestStars = 0;
    newBlockStars = block.model.starsObtained;
  }

  // Helpers for modifying newChaptersData
  var setBlockUnlocked = function setBlockUnlocked(blockID, newUnlocked, oldUnlocked) {
    var lockOverride = atBlock(state, blockID).getIn("model.lockOverride");
    var hasOverride = lockOverride === "unlocked" || lockOverride === "locked";
    if (!hasOverride && newUnlocked !== oldUnlocked) {
      newBlocksData[blockID] = {
        unlocked: newUnlocked
      };
    }
  };
  var grade = chapter.gradeNumber;
  var chapterID = chapter.chapterID;

  // Return value
  var newBlocksData = {};
  var blocksUnlockedData = _.map(Derived.getChapterMainBlocks(state, chapterID), function (b) {
    return {
      blockID: b.model.blockID,
      stars: b.model.blockID === block.model.blockID ? newBlockStars : b.model.starsObtained,
      requirementLevel: b.model.requirementLevel,
      blockType: b.model.blockType,
      unlocked: b.model.unlocked,
      timesStarted: b.model.timesStarted
    };
  });
  var unlockedBlockIDs = TrainerCore.getUnlockedBlockIDs(blocksUnlockedData, chapter.unlocked);
  chapter.blockIDs.forEach(function (bID, ind) {
    var isAlreadyUnlocked = blocksUnlockedData[ind].unlocked;
    setBlockUnlocked(bID, isAlreadyUnlocked || _.includes(unlockedBlockIDs, bID), isAlreadyUnlocked);
  });
  var specialUnlockedBlocks = TrainerCore.getSpecialUnlockedBlocks({
    grade: grade,
    chapterIndex: chapter.chapterIndex,
    blocksWithStars: finalChapterBlocksWithStars,
    testStars: finalTestStars,
    specialBlockData: Derived.areChapterAuxBlocksUnlocked(state, chapterID),
    blocksData: blocksUnlockedData
  });
  var auxBlocksUnlockedData = _.map(Derived.getChapterAuxBlocks(state, chapterID), function (b) {
    return b.model.unlocked;
  });
  Derived.getChapterAuxBlockNames().forEach(function (type, i) {
    var bID = chapter[type + "BlockID"];
    if (bID) setBlockUnlocked(bID, specialUnlockedBlocks[type], auxBlocksUnlockedData[i]);
  });
  return newBlocksData;
};
var setFailUnlockFlag = function setFailUnlockFlag(state, blockID) {
  // It's possible that other blocks become unlocked just by us starting this
  // block for the nth time
  var blockModelChanges = doUnlockingWithinChapter(state, {
    chapter: atChapterByBlockID(state, blockID).getIn("model"),
    block: atBlock(state, blockID).get(),
    useCurrentValues: true
  });
  if (!_.isEmpty(blockModelChanges)) {
    // If we have changes due to starting a block, it must mean they are
    // satisfying unlock rule for "failing". Flag this so we know whether or
    // not to trigger "fail" unlock message later.
    var blockIDs = Object.keys(blockModelChanges);
    state = atBlocks(state).setKeys(blockIDs, function (bl, id) {
      // Double-check it's unlocked.
      if (blockModelChanges[id].unlocked) {
        blockModelChanges[id].unlockedByTimesStartedOnBlockID = blockID;
        return extendIn(bl, "model", blockModelChanges[id]);
      } else {
        return bl;
      }
    });
  }
  return state;
};

// Gets unlocking changes to lab types and the easiest blocks within them.
// Also gets changes in the lab navigation modal to reflect this unlocking.
var doUnlockingAcrossLabTypes = function doUnlockingAcrossLabTypes(state, chapterID, level) {
  var finishData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var labTypeModels = atLabTypes(state).get();
  var unlockedChapterIDs = [];
  if (chapterID) unlockedChapterIDs = GradeChapter.getAllChaptersUpTo(chapterID);
  var labTypeModelChanges = {};
  var labModalTypeChanges = {};
  var _finishData$labModalB = finishData.labModalBlockChanges,
    labModalBlockChanges = _finishData$labModalB === void 0 ? {} : _finishData$labModalB,
    _finishData$labBlockM = finishData.labBlockModelChanges,
    labBlockModelChanges = _finishData$labBlockM === void 0 ? {} : _finishData$labBlockM;
  _.each(labTypeModels, function (labType, typeID) {
    var typeModel = _.get(labType, "model");
    var _ref = typeModel || {},
      requiredChapterID = _ref.requiredChapterID,
      unlocked = _ref.unlocked,
      lockType = _ref.lockType,
      unlockLevel = _ref.unlockLevel,
      blockIDs = _ref.blockIDs;
    var unlockedByChapter = requiredChapterID && _.includes(unlockedChapterIDs, requiredChapterID) && level >= Constants.PUZZLE_LAB_XP_LEVEL_UNLOCK;
    var unlockedByLevel = level && unlockLevel && unlockLevel <= level;
    if (typeModel && lockType === "progress" && !unlocked && (unlockedByChapter || unlockedByLevel)) {
      // Unlock the lab type.
      labTypeModelChanges[typeID] = {
        unlocked: true
      };
      // Unlock the easiest blocks in this lab type.
      var labBlockIDs = blockIDs;
      _.each(labBlockIDs, function (bid, i) {
        var blockModel = atLabBlock(state, bid).getIn("model");
        if (blockModel && blockModel.celestialID === 1 && !blockModel.lockOverride && !blockModel.unlocked) {
          labBlockModelChanges[bid] = {
            unlocked: true
          };
        }
      });
    }
  });
  var labModalTypeInfo = atAllLabTypes(state).getIn(["typeInfo"]);
  _.each(labModalTypeInfo, function (labType, typeIndex) {
    var _ref2 = labType || {},
      requiredChapterID = _ref2.requiredChapterID,
      unlocked = _ref2.unlocked,
      lockType = _ref2.lockType,
      unlockLevel = _ref2.unlockLevel,
      blockData = _ref2.blockData;
    var unlockedByChapter = requiredChapterID && _.includes(unlockedChapterIDs, requiredChapterID);
    var unlockedByLevel = level && unlockLevel && unlockLevel <= level;
    if (lockType === "progress" && !unlocked && requiredChapterID && (unlockedByChapter || unlockedByLevel)) {
      // Unlock the lab type in the navigation modal
      labModalTypeChanges[typeIndex] = {
        unlocked: true
      };
      // Unlock the first few blocks in the navigation modal
      labModalBlockChanges[typeIndex] = _.map(blockData, function (b) {
        if (b && b.celestialID === 1 && b.lockType === "progress" && !b.unlocked) {
          return {
            unlocked: true
          };
        }
        return {};
      });
    }
  });
  // Update lab blocks with finishData
  if (!_.isEmpty(labBlockModelChanges)) {
    var labBlockIDs = Object.keys(labBlockModelChanges);
    state = atLabBlocks(state).setKeys(labBlockIDs, function (bl, id) {
      return extendIn(bl, "model", labBlockModelChanges[id]);
    });
  }
  // Update changes to blocks in the lab navigation modal (such as celestials earned or if blocks are unlocked)
  _.each(labModalBlockChanges, function (bls, typeIndex) {
    _.each(bls, function (blockChanges, i) {
      state = atAllLabTypes(state).extendIn(["typeInfo", typeIndex, "blockData", i], blockChanges);
    });
  });
  // Starring a trainer block can unlock lab types. Those changes are below.
  // Update changes to types in the lab navigation modal (such as unlocking)
  _.each(labModalTypeChanges, function (modalTypeChanges, typeIndex) {
    state = atAllLabTypes(state).extendIn(["typeInfo", typeIndex], modalTypeChanges);
  });
  // Update changes to lab type models (such as unlocking)
  _.each(labTypeModelChanges, function (labTypeChanges, typeID) {
    state = atLabType(state, typeID).extendIn(["model"], labTypeChanges);
  });
  return state;
};

// Returns an object mapping block IDs to updates to their models.
var doUnlockingWithinLabType = function doUnlockingWithinLabType(state, unlockData) {
  var type = unlockData.type,
    block = unlockData.block;

  // Helper for modifying newBlocksData
  var setBlockUnlocked = function setBlockUnlocked(blockID, unlocked) {
    var lockOverride = atLabBlock(state, blockID).getIn("model.lockOverride");
    var hasOverride = lockOverride === "unlocked" || lockOverride === "locked";
    if (!hasOverride) {
      newBlocksData[blockID] = {
        unlocked: unlocked
      };
    }
  };
  var typeID = type.typeID;

  // Return value
  var newBlocksData = {};

  // Unlocking of blocks within lab types only happens if the type is unlocked.
  if (type.unlocked) {
    var celestialID = _.get(block, "model.celestialID", 0);
    var blocksUnlockedData = Derived.areLabTypeBlocksUnlocked(state, typeID);
    var blockIDs = Derived.getLabTypeBlockIDs(state, typeID);
    var blocksCelestialData = Derived.getLabTypeBlocksCelestialIDs(state, typeID);
    var unlockedBlocks = TrainerCore.getUnlockedLabBlocks(blocksUnlockedData, blocksCelestialData, celestialID);
    blockIDs.forEach(function (bID, ind) {
      setBlockUnlocked(bID, unlockedBlocks[ind]);
    });
  }
  var finishedBlockID = block.model.blockID;
  if (newBlocksData[finishedBlockID]) {
    newBlocksData[finishedBlockID].celestialEarned = true;
  } else {
    newBlocksData[finishedBlockID] = {
      celestialEarned: true
    };
  }
  return newBlocksData;
};
var finishMiscBlock = function finishMiscBlock(block, state, resultIncomplete) {
  if (!block.currentResult) {
    return;
  }
  var result = block.currentResult;
  var newStars = OpsResult.getStars(result);
  var increasedXP = TrainerCore.getFinishMiscBlockXP(block);
  var increasedBucks = TrainerCore.getFinishMiscBlockBucks(block);
  var user = atUser(state).get();
  var newUserData = {
    xp: user.model.xp || increasedXP,
    bucks: user.model.bucks || increasedBucks
  };
  return {
    userModelChanges: newUserData,
    starsObtained: newStars
  };
};
var startBlock = function startBlock(block, response, clock, _ref3) {
  var _ref3$miscBlockName = _ref3.miscBlockName,
    miscBlockName = _ref3$miscBlockName === void 0 ? null : _ref3$miscBlockName,
    _ref3$forDemo = _ref3.forDemo,
    forDemo = _ref3$forDemo === void 0 ? false : _ref3$forDemo;
  var responseBlock = {};
  if (miscBlockName) responseBlock = APIFormat.convertMiscBlock(miscBlockName, response.block);
  var setList = response.result.setList;
  var resultType = setList.resultType;
  block = _.clone(block);
  block.model = _.extend({}, block.model, responseBlock, InstructionsUtil.processBlockInstructions(response.block, setList, response.instructionsProblems));

  // Increase timesStarted
  block.model.timesStarted = _.get(block, "model.timesStarted", 0) + 1;
  var mixpanelProperties = {
    blockID: block.blockID,
    chapterID: block.model.chapterID,
    blockType: block.model.blockType,
    blockName: block.model.displayName,
    gradeNumber: block.model.gradeNumber,
    chapterIndex: block.model.chapterIndex,
    blockIndex: block.model.blockIndex
  };
  Mixpanel.track(TRAINER_ACTIVITY_EVENTS.LessonStarted, mixpanelProperties);
  var initBlockFunc = forDemo ? OpsResult.initForDemoBlock : OpsResult.initForBlock;
  var playBlockResult = initBlockFunc(response, block.model, clock);
  playBlockResult.source.miscBlockName = miscBlockName;
  //Make sure this result is accounted for in the recent history
  block.model.recentHistory = _.takeRight(_.reject(block.model.recentHistory, {
    id: playBlockResult.resultID
  }), 4);
  block.model.recentHistory.push({
    id: playBlockResult.resultID,
    finishStatus: response.result.finishStatus,
    stars: playBlockResult.starsObtained,
    maxStars: playBlockResult.starsAvailable,
    percentComplete: response.result.percentComplete
  });
  // Update whether the block is finished and its percentComplete
  if (resultType !== "trophy") {
    block.model.percentComplete = response.result.percentComplete;
  }
  if (resultType === "trophy") {
    var trophy = LoadState.loadSuccess(block.trophy);
    trophy.trophyResult = playBlockResult;
    block.trophy = trophy;
  } else {
    block = LoadState.loadSuccess(block);
    block.currentResult = playBlockResult;
  }

  //Mark block as unfinished once entered for tests
  var isTest = resultType === "test" || resultType === "bookTest";
  if (isTest && !block.currentResult.isComplete) {
    block.model.unfinished = true;
  }
  return block;
};
var finishBlock = function finishBlock(block, state, resultIncomplete) {
  if (!block.currentResult) {
    return;
  }
  var blockID = block.blockID;
  var result = block.currentResult;
  var newStars = OpsResult.getStars(result);
  var stars = Math.max(block.model.starsObtained, newStars);
  var starDelta = Math.max(newStars - block.model.starsObtained, 0);
  var gainedFirstStar = block.model.starsObtained === 0 && newStars > 0;
  var isMiscBlock = !!result.source.miscBlockName;
  var wasTrophyPreviouslyAvailable = block.model.isTrophyAvailable || false;
  var user = atPageUser(state).get();
  var newUserData = {};
  var newBlocksData = {};
  var newChaptersData = {};
  var chapterIDsToReset = [];
  if (!isMiscBlock) {
    var chapterCR = atChapterByBlockID(state, blockID);
    var chapterID = chapterCR.getIn("chapterID");
    var chapter = chapterCR.getIn("model");
    var chapterUpdate = {
      stars: chapter.stars + starDelta,
      blocksWithStars: chapter.blocksWithStars + (gainedFirstStar ? 1 : 0)
    };

    // Unlocking computation
    newChaptersData = _defineProperty({}, chapterID, chapterUpdate);
    var auxBlocks = Derived.getChapterAuxBlocks(state, chapterID);
    var reviewStars = _.get(auxBlocks, ["review", "model", "stars"], 0);
    if (blockID === chapter.reviewBlockID) {
      reviewStars = stars;
    }
    var testStars = _.get(auxBlocks, ["test", "model", "stars"], 0);
    var testTimesCompleted = _.get(auxBlocks, ["test", "model", "timesCompleted"], 0);
    if (blockID === chapter.testBlockID) {
      testStars = stars;
      testTimesCompleted += 1;
    }
    var newChaptersUnlockData = doUnlockingAcrossChapters(state, {
      userID: user.userID,
      chapter: chapter,
      newChapterBlocksWithStars: chapterUpdate.blocksWithStars,
      newTestStars: testStars,
      newTestTimesCompleted: testTimesCompleted
    });
    _.merge(newChaptersData, newChaptersUnlockData);
    newBlocksData = doUnlockingWithinChapter(state, {
      block: block,
      newBlockStars: stars,
      chapter: chapter,
      newChapterStars: chapterUpdate.stars,
      newChapterBlocksWithStars: chapterUpdate.blocksWithStars,
      newReviewStars: reviewStars,
      newTestStars: testStars
    });
    chapterIDsToReset = getChaptersToReloadForUnlocking(newChaptersUnlockData);
    _.pull(chapterIDsToReset, chapterID);

    // Earned stars, max stars

    var newMaxStars = 3;
    var limitedMaxStarExp = false;
    if (result.limitStarsBasedOnFinish) {
      newMaxStars = 1;
      limitedMaxStarExp = TimeFormat.getDateTimeString(moment().add(Constants.MAX_STARS_RETRY_LIMIT_DAYS, "days"));
    } else if (result.limitStarsUntil && moment(result.limitStarsUntil).isAfter(moment())) {
      //If there is a prospective limiting of max stars and that time has not passed,
      //set max stars to 1 and the expiration to that time.
      newMaxStars = 1;
      limitedMaxStarExp = result.limitStarsUntil;
    }
    newBlocksData[blockID] = newBlocksData[blockID] || {};
    _.extend(newBlocksData[blockID], {
      starsObtained: stars,
      starsAvailable: newMaxStars,
      limitedStarsExpiration: limitedMaxStarExp,
      limitedInProgressResult: false
    });

    // We are adding these values here because starsObtainedAt usually
    // comes from the backend, but we need it to determine when
    // a student first got stars in a lesson and be able to display
    // this on the Assignments tab in the Profile page without needing
    // a page refresh
    if (!newBlocksData[blockID].starsObtainedAt && newBlocksData[blockID].starsObtained > 0 && result.trialsToSave && result.trialsToSave.length) {
      var lastSubmitted = _.first(result.trialsToSave).submittedAt;
      var timeLastSubmitted = moment(lastSubmitted);
      _.extend(newBlocksData[blockID], {
        starsObtainedAt: [lastSubmitted],
        starsObtainedAtTZ: [timeLastSubmitted.utcOffset() / 60]
      });
    }
    // T60304 - Stars are not considered for XP granting if a student
    // is on a limited star cool-down
    var starsConsideredForXP = result.limitStarsUntil ? 0 : newStars;
    var increasedXp = TrainerCore.getFinishBlockXP(block.model.starsObtained, starsConsideredForXP);
    var increasedBucks = TrainerCore.getFinishBlockBucks(block.model.starsObtained, starsConsideredForXP);

    //If the result is complete, then update some finishing block info
    if (!resultIncomplete) {
      var mixpanelProperties = {
        blockID: block.blockID,
        chapterID: block.model.chapterID,
        blockType: block.model.blockType,
        blockName: block.model.name,
        starsObtained: newStars,
        totalStars: stars,
        xpGained: increasedXp,
        bucksGained: increasedBucks,
        timesCompleted: block.model.timesCompleted + 1
      };
      Mixpanel.track(TRAINER_ACTIVITY_EVENTS.LessonCompleted, mixpanelProperties);
      var testCooldownInfo = {};
      if (result.resultType === "test") {
        if (newStars === 0) {
          testCooldownInfo = {
            testCooldownReason: "fail",
            progressLockSource: "cooldown",
            testCooldownExpiration: TimeFormat.getDateTimeString(moment.utc(result.finishedAt).utcOffset(result.finishedAtTZ * 60).add(Constants.TEST_FAIL_COOLDOWN_DAYS, "days"))
          };
        } else {
          testCooldownInfo = {
            testCooldownReason: null,
            testCooldownExpiration: null
          };
        }
      }
      var isTrophyAvailable = block.model.isTrophyAvailable || block.model.doesTrophyExist && stars === 3;
      _.extend(newBlocksData[blockID], {
        unfinished: false,
        timesCompleted: block.model.timesCompleted + 1,
        hasHistory: true,
        isTrophyAvailable: isTrophyAvailable,
        trophyUnlocked: !wasTrophyPreviouslyAvailable && isTrophyAvailable,
        xp: block.model.xp + increasedXp
      }, testCooldownInfo);
    }
    newUserData = {
      xp: user.model.xp + increasedXp,
      bucks: user.model.bucks + increasedBucks,
      stars: user.model.stars + starDelta
    };
    var homework = user.model.homework;
    var optionalBlockIDs = homework && homework.optionalBlockIDs || [];
    if (newStars && !block.model.starsObtained && _.includes(optionalBlockIDs, blockID)) {
      newUserData.homework = OpsUser.recomputeOptHWOnCompleteBlock(user, blockID, newStars);
    }
  }
  return {
    userModelChanges: newUserData,
    blockModelChanges: newBlocksData,
    chapterModelChanges: newChaptersData,
    chapterIDsToReset: chapterIDsToReset,
    starsObtained: newStars
  };
};
var finishLabBlock = function finishLabBlock(block, state, isFirstResult) {
  if (!block.currentResult) {
    return;
  }
  var blockID = block.blockID;
  var user = atPageUser(state).get();
  var typeCR = atLabTypeByBlockID(state, blockID);
  var typeID = typeCR.getIn("typeID");
  var type = typeCR.getIn("model");
  var newBlocksData = doUnlockingWithinLabType(state, {
    type: type,
    block: block
  });

  // Update lab types modal with newly unlocked blocks
  var typeModalInfo = atAllLabTypes(state, user.model.userID).getIn("typeInfo");
  var labModalBlockChanges = {};
  if (typeModalInfo) {
    var typeIndex = _.findIndex(typeModalInfo, function (t) {
      return t.typeID === typeID;
    });
    labModalBlockChanges[typeIndex] = _.map(typeModalInfo[typeIndex].blockData, function (b) {
      var blockInfo = _.get(newBlocksData, [b.labBlockID]);
      return _.pick(blockInfo, ["unlocked", "celestialEarned"]);
    });
  }
  newBlocksData[blockID] = newBlocksData[blockID] || {};
  var increasedXp = isFirstResult ? TrainerCore.getFinishLabBlockXP(block.model.celestialID) : 0;
  var increasedBucks = isFirstResult ? TrainerCore.getFinishLabBlockBucks(block.model.celestialID) : 0;
  var newUserData = {
    xp: user.model.xp + increasedXp,
    bucks: user.model.bucks + increasedBucks
  };
  return {
    userModelChanges: newUserData,
    labBlockModelChanges: newBlocksData,
    labModalBlockChanges: labModalBlockChanges
  };
};
var finishTrophy = function finishTrophy(block, state) {
  if (!(block.trophy && block.trophy.trophyResult)) {
    return;
  }
  var blockID = block.blockID;
  var blockUpdate = _defineProperty({}, blockID, {
    isTrophyComplete: true,
    trophies: block.model.trophies + 1
  });
  var chapterCR = atChapterByBlockID(state, blockID);
  var chapterID = chapterCR.getIn("chapterID");
  var chapterModel = chapterCR.getIn("model");
  var chapterUpdate = _defineProperty({}, chapterID, {
    trophies: chapterModel.trophies + 1
  });
  var user = atPageUser(state).get();
  var newUser = {
    bucks: user.model.bucks + TrainerCore.getFinishTrophyBucks()
  };
  return {
    userModelChanges: newUser,
    blockModelChanges: blockUpdate,
    chapterModelChanges: chapterUpdate
  };
};

// Determines if the result is done before doing anything.
var checkResultFinished = function checkResultFinished(state, result, finishBlockBeforeComplete, clock, emitEvent) {
  var demo = state.page.demo;
  var blockID = result.source.blockID;
  var isLab = OpsResult.isLabBlock(result);
  var isMisc = OpsResult.isMiscBlock(result);
  var isTrophy = OpsResult.isTrophy(result);
  var isTutorial = OpsResult.isTutorial(result);
  var block = atBlockByResultSource(state, result.source).get();
  if (!(OpsResult.isBlockOrTrophy(result) || isLab || isTutorial) || !blockID || !block && !isTutorial) {
    return state;
  }
  var percentComplete = OpsResult.getPercentComplete(result);
  var resultUnfinished = !OpsResult.isFinished(result);
  var updatePercentCompletion = function updatePercentCompletion(b) {
    if (isTrophy) return b;
    return OpsBlock.updatePercentCompletion(b, percentComplete, resultUnfinished);
  };

  // Clear block history so it can reload with new results
  if (!demo && !isLab) state = clearBlockHistory(state);
  // Check if finished. If not, we only update the percent complete.
  if (!finishBlockBeforeComplete && resultUnfinished) {
    return atBlockByResultSource(state, result.source).set(updatePercentCompletion);
  }
  var finishData = {};
  if (isTrophy) {
    finishData = finishTrophy(block, state);
  } else if (isLab) {
    finishData = finishLabBlock(block, state, result.isFirst);
  } else if (isMisc && block.model.miscBlockName === "tutorial") {
    finishData = finishMiscBlock(block, state, resultUnfinished);
  } else {
    finishData = finishBlock(block, state, resultUnfinished);
  }
  if ((finishData.starsObtained || isLab) && !demo && !isMisc) {
    // Unlock lab types that have a requiredChapterID restriction if the
    // user earned at least 1 star in this chapter and this chapter comes after
    // or is equal to the requiredChapterID. Unlock the easiest blocks of those
    // lab types too.
    var chapterCR = atChapterByBlockID(state, blockID);
    var chapterID = chapterCR.getIn("chapterID");
    state = doUnlockingAcrossLabTypes(state, chapterID, null, finishData);

    // Also remove any "fail" unlock flags if a star was earned
    var allBlockIDs = _.keys(atBlocks(state).get());
    state = atBlocks(state).setKeys(allBlockIDs, function (bl) {
      if (bl.model.unlockedByTimesStartedOnBlockID) {
        return setIn(bl, ["model", "unlockedByTimesStartedOnBlockID"], null);
      } else {
        return bl;
      }
    });
  }
  var user = atUser(state).get();
  var trophyNotif = _.get(user, ["model", "eventsTriggered", "notifications", "trophyUnlocked"]);
  var trophyUnlocked = _.get(finishData, ["blockModelChanges", block && block.blockID, "trophyUnlocked"]);
  if (!isTutorial && trophyUnlocked && !trophyNotif) {
    state = atUser(state).setIn(["model", "eventsTriggered", "notifications", "trophyUnlocked"], "notShown");
  }

  //If this is finishing before it's complete, still update the percent complete
  if (finishBlockBeforeComplete) {
    state = atBlockByResultSource(state, result.source).set(updatePercentCompletion);
  }

  // Update user model with finishData
  var userCR = demo ? atTempUser(state) : atUser(state);
  var userModelChanges = _.get(finishData, "userModelChanges", {});
  state = userCR.extendIn("model", userModelChanges);
  if (!isLab && !isMisc) {
    // Update chapter models with finishData
    var chapterIDs = Object.keys(finishData.chapterModelChanges);
    state = atChapters(state).setKeys(chapterIDs, function (ch, id) {
      // Only update chapters that have been loaded. Other ones will have the correct info
      // from the backend when loaded & don't need to be updated.
      if (ch) {
        return extendIn(ch, "model", finishData.chapterModelChanges[id]);
      } else {
        return ch;
      }
    });
    state = loadRestartChapters(state, finishData.chapterIDsToReset);
  }

  //Update the result with finishData (if it was finished)
  if (!resultUnfinished) {
    //Fill in some finishing data
    state = atCurrResult(state).set(function (newResult) {
      var finishedRes = _.extend({}, newResult, {
        starsObtained: finishData.starsObtained,
        isComplete: true,
        showSummary: true,
        showOverview: false,
        showTestPart1Decision: false,
        hasSeenSummary: false,
        // This is the copy for message so student sees same message each time
        // they go back to summary page from previous problem.
        summaryMessage: isMisc ? "" : OpsResult.getSummaryMessage(newResult, state.user.model && state.user.model.displayName)
      });
      return finishedRes;
    });
    emitEvent("resultCompleted", {
      stars: finishData.starsObtained
    });

    // For test, ensure local vault lastPlayedData knows the test is done so we
    // don't think they're still in the test when evaluating whether to force them
    // back to the test
    if (atCurrResult(state).getIn(["resultType"]) === "test") state = atUser(state).extendIn(["model", "lastPlayedData"], {
      testInProgress: null
    });
  }

  // Update trainer blocks with finish data
  if (finishData.blockModelChanges) {
    var blockIDs = Object.keys(finishData.blockModelChanges);
    state = atBlocks(state).setKeys(blockIDs, function (bl, id) {
      var newBlock = extendIn(bl, "model", finishData.blockModelChanges[id]);
      if (demo && finishData.blockModelChanges[id].starsObtained !== undefined) {
        var history = LoadState.loadSuccess(newBlock.history);
        var results = _.cloneDeep(_.get(bl, ["history", "allResults"])) || [];
        results.unshift(OpsResult.initForDemoHistory(atCurrResult(state).get(), newBlock.model));
        newBlock = setIn(newBlock, "history", history);
        newBlock = extendIn(newBlock, "history", {
          allResults: results,
          isMostRecentResultBroken: false,
          lastCompletedResultID: null
        });
      }
      return newBlock;
    });
  }
  state = atBlockByResultSource(state, result.source).set(function (bl) {
    if (bl.model.blockType === "test" && finishData.starsObtained === 0 && !bl.model.ignoreCooldown) {
      bl = setIn(bl, "model.progressLock", "locked");
      if (bl.model.lockOverride !== "unlocked") {
        bl = setIn(bl, "model.unlocked", false);
      }
    }
    if (!isLab && !isMisc) {
      var recentHistoryPath = ["model", "recentHistory", bl.model.recentHistory.length - 1];
      bl = extendIn(bl, recentHistoryPath, {
        finishStatus: "completed",
        stars: finishData.starsObtained
      });
    }
    return bl;
  });
  return state;
};
var saveCurrentResultNow = function saveCurrentResultNow(state, vault, options) {
  var _ref4 = options || {},
    _ref4$checkFinished = _ref4.checkFinished,
    checkFinished = _ref4$checkFinished === void 0 ? false : _ref4$checkFinished,
    _ref4$earnedNewStar = _ref4.earnedNewStar,
    earnedNewStar = _ref4$earnedNewStar === void 0 ? false : _ref4$earnedNewStar,
    _ref4$ignoreSubmitTok = _ref4.ignoreSubmitToken,
    ignoreSubmitToken = _ref4$ignoreSubmitTok === void 0 ? false : _ref4$ignoreSubmitTok;
  var result = atCurrResult(state).get();
  if (checkFinished) {
    state = checkResultFinished(state, result, !!earnedNewStar, vault.clock, vault.emitEvent);
    result = atCurrResult(state).get();
  }
  ResultSync.saveResultNow(result, state, vault.storage, vault.api, vault.clock, vault.throttler, {
    ignoreSubmitToken: ignoreSubmitToken
  });

  // Update last played data when saving trial.
  state = atPageUser(state).set(function (u) {
    return OpsUser.updateLastPlayedData(u, result);
  });
  if (!state.page.demo) {
    // Don't leave out-of-date profile data.
    state = clearProfileAndHomeworkForSelf(state, vault.clock);
  }
  // Update chapter path avatar location
  state = atChapterPath(state).set(function (cp) {
    return OpsChapterPath.updateAvatarOverrideContext(cp, {
      forLastPlayed: true
    });
  });
  return state;
};
var updatePageAndHistory = function updatePageAndHistory(state, emitEvent, newValue) {
  var oldPage = atPage(state).get();
  state = atPage(state).set(newValue);
  if (atPage(state).get() !== oldPage) {
    emitEvent("addToBrowserHistory");
  }
  return state;
};

/**
 * Preloads the read aloud audio for the current problem.
 * Called after problem switch to warm up the audio cache.
 */
var preloadReadAloudForProblem = function preloadReadAloudForProblem(state, emitEvent) {
  var page = atPage(state).get();
  if (!OpsPage.shouldShowReadAloud(page)) {
    return;
  }
  var problem = atCurrProblem(state).get();
  if (!problem || !problem.model) {
    return;
  }

  // Get the problem read aloud text (not solution, since this is a new problem)
  var text = EngineCreator.getProblemReadAloudText(problem.model);
  if (text) {
    emitEvent("readAloudPreload", text);
  }
};

/**
 * Preloads the read aloud audio for the current problem's solution.
 * Called after submission to warm up the audio cache for solution view.
 */
var preloadReadAloudForSolution = function preloadReadAloudForSolution(state, emitEvent) {
  var page = atPage(state).get();
  if (!OpsPage.shouldShowReadAloud(page)) {
    return;
  }
  var problem = atCurrProblem(state).get();
  if (!problem || !problem.model) {
    return;
  }

  // Get the solution read aloud text
  var text = EngineCreator.getSolutionReadAloudText(problem.model);
  if (text) {
    emitEvent("readAloudPreload", text);
  }
};
var goToNextProblem = function goToNextProblem(state, clock, emitEvent) {
  var user = atUser(state).get();
  var problemsUnlocked = OpsUser.hasKey(user, "trainer all problems unlocked");
  var result;
  state = atCurrResult(state).set(function (res) {
    result = OpsResult.goToNextProblem(res, problemsUnlocked, clock);
    return result;
  });
  emitEvent("clearDrawvas");
  state = updatePageAndHistory(state, emitEvent, function (page) {
    return TrainerPage.syncToResult(page, result);
  });
  // Preload read aloud audio for the new problem
  preloadReadAloudForProblem(state, emitEvent);
  return state;
};

//
// The main action handlers
//

var actionHandlers = (_actionHandlers = {}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_actionHandlers, AT.TRAINER_INITIAL, function (vault, state, action) {
  ResultSync.setupInVault(vault);
  state = initDevProblem(vault, state);
  return state;
}), AT.PLAY_BLOCK_REQUEST, function (vault, state, action) {
  var blockCR = atBlock(state, action.blockID);
  var isTest = OpsBlock.isAnyTest(blockCR.get());
  var loadCR = action.isTrophy ? blockCR.in("trophy") : blockCR;
  state = loadCR.set(function (oldValue) {
    if (!state.connected) return LoadState.loadError(oldValue, "E_NOT_CONNECTED");
    return LoadState.loadStart(oldValue, function () {
      var forceResume = OpsUser.hasKey(state.user, "trainer stay on last set");
      var forcePlayProblemIndex;
      if (action.setNumber && isTest && OpsUser.hasTeacherRole(state.user)) {
        forcePlayProblemIndex = state.page.problemIndex;
      }
      return vault.api.playBlock(action.blockID, action.isTrophy, action.discardLimitedResults, forceResume, action.setNumber, forcePlayProblemIndex);
    });
  });
  if (state.connected && action.discardLimitedResults) {
    //If the user just chose to discard limited results, navigate to the block's page
    //unmark it from having a limited result
    blockCR = atBlock(state, action.blockID);
    var blockModel = blockCR.getIn("model");
    if (blockModel) {
      state = blockCR.extendIn("model", {
        limitedInProgressResult: false,
        percentComplete: 0
      });
      state = atPage(state).set(URLMake.state.forBlock(blockCR.get()));
    }
  }
  return state;
}), AT.PLAY_BLOCK_SUCCESS, function (vault, state, action) {
  var response = action.data;
  var blockID = response.block.id;
  var setList = response.result.setList;
  var resultType = setList.resultType;
  if (resultType === "test") {
    var startingTest = atUser(state).getIn(["model", "enteringTest"], null);
    var testInProgress = atUser(state).getIn(["model", "lastPlayedData", "testInProgress"]);
    var user = atUser(state).get();

    // don't start a new test if you haven't opted into it
    if (startingTest !== response.block.chapterID && !testInProgress && !OpsUser.hasTeacherRole(user) && !OpsUser.hasKey("trainer allow unfinished test")) {
      var context = GradeChapter.chapterIDToContext(response.block.chapterID);
      var gradeNumber = context.gradeNumber,
        chapterIndex = context.chapterIndex;
      state = atPage(state).set(function (p) {
        return URLMake.state.forChapterFromNumbers(gradeNumber, chapterIndex);
      });
      state = atBlock(state, blockID).set(function (b) {
        return LoadState.loadInit(b);
      });
      return state;
    }
    state = atUser(state).setIn(["model", "enteringTest"], null);
  }

  // First adding any received instructions problems into shared problems
  state = OpsProblem.setSharedProblems(state, response.instructionsProblems, response.result);

  // Then updating the block with the new result
  state = atBlock(state, blockID).set(function (b) {
    return startBlock(b, response, vault.clock, {
      forDemo: state.page.demo
    });
  });
  if (TrainerPage.isOnBlock(atPage(state).get(), state, blockID)) {
    state = atPage(state).set(function (page) {
      return TrainerPage.fillProblemIndex(page, state);
    });
    if (!action.problemsData) {
      // TODO: Why does review need to not do the syncToPage call?
      state = atCurrResult(state).set(function (res) {
        return OpsResult.syncToPage(res, atPage(state).get(), vault.clock);
      });
    }
    if (resultType === "test") {
      // Set lastPlayedData to reflect test
      var block = atBlock(state, blockID).get();
      state = OpsUser.setTestInProgress(state, block);
    }
    // Save to back end immediately (for test, quitting requires back end result to
    // be fully populated. For everything else)
    state = saveCurrentResultNow(state, vault, {
      hasTrial: true,
      ignoreSubmitToken: true
    });
    // Preload read aloud audio for the initial problem
    preloadReadAloudForProblem(state, vault.emitEvent);
    preloadReadAloudForSolution(state, vault.emitEvent);
  }

  //Check if a result for this block was for a broken set and got deleted.
  //If so, inform the student.
  if (response.notifyDeletedBrokenResult) {
    vault.emitEvent("showMessage", "previousResultForBrokenSetDeleted", {
      isTrophy: resultType === "trophy"
    });
  }
  // Check if a result for this block was for an outdated trophy set and got deleted.
  //If so, inform the student.
  if (response.notifyTrophyOutdatedResult) {
    vault.emitEvent("showMessage", "previousResultForOutdatedTrophyDeleted");
  }
  state = setFailUnlockFlag(state, blockID);

  // Update chapter path avatar location
  state = atChapterPath(state).set(function (cp) {
    return OpsChapterPath.updateAvatarOverrideContext(cp, {
      forLastPlayed: true
    });
  });
  return state;
}), AT.PLAY_BLOCK_FAIL, function (vault, state, action) {
  var loadCR = atBlock(state, action.payload.blockID);
  loadCR = action.payload.isTrophyRequest ? loadCR.in("trophy") : loadCR;
  state = loadCR.set(function (oldValue) {
    return LoadState.loadError(oldValue, action.error);
  });
  if (action.error === "E_LOCKED") {
    state = loadRestartAllChapters(state);
  }
  return state;
}), AT.PLAY_BOOK_TEST_BLOCK_REQUEST, function (vault, state, action) {
  var loadCR = atMiscBlock(state, action.bookTestHash).canCreate();
  state = loadCR.set(function (oldValue) {
    if (!state.connected) return LoadState.loadError(oldValue, "E_NOT_CONNECTED");
    oldValue = LoadState.loadInit(oldValue);
    return LoadState.loadStart(oldValue, function () {
      return vault.api.playBookTestBlock(action.bookTestHash);
    });
  });
  return state;
}), AT.PLAY_BOOK_TEST_BLOCK_SUCCESS, function (vault, state, action) {
  var response = action.data;
  var miscBlockName = action.payload.miscBlockName;
  state = atUser(state).setIn(["model", "enteringTest"], null);

  // First adding any received instructions problems into shared problems
  state = OpsProblem.setSharedProblems(state, response.instructionsProblems, response.result);

  // Then updating the block with the new result
  state = atMiscBlock(state, miscBlockName).set(function (b) {
    return startBlock(b, response, vault.clock, {
      miscBlockName: miscBlockName
    });
  });
  if (TrainerPage.isOnMiscBlock(atPage(state).get(), state, miscBlockName)) {
    state = atPage(state).set(function (page) {
      return TrainerPage.fillProblemIndex(page, state);
    });
    if (!action.problemsData) {
      // TODO: Why does review need to not do the syncToPage call?
      state = atCurrResult(state).set(function (res) {
        return OpsResult.syncToPage(res, atPage(state).get(), vault.clock);
      });
    }

    // Set lastPlayedData to reflect test
    var block = atMiscBlock(state, miscBlockName).get();
    if (response.isNewResult) {
      state = OpsUser.setTestInProgress(state, block);
    }
    // Preload read aloud audio for the initial problem
    preloadReadAloudForProblem(state, vault.emitEvent);
    preloadReadAloudForSolution(state, vault.emitEvent);
  }
  return state;
}), AT.PLAY_BOOK_TEST_BLOCK_FAIL, function (vault, state, action) {
  var unlocksAt = _.get(action, "moreInfo.classTestInfo.unlocksAt", null);
  state = atMiscBlock(state, action.payload.miscBlockName).set(function (b) {
    b = setIn(b, "unlocksAt", unlocksAt);
    b = LoadState.loadError(b, action.error);
    return b;
  });
  return state;
}), AT.LOAD_SHARED_DEMO_PROBLEMS, function (vault, state, action) {
  var blockID = action.blockID;
  var response = action.isTrophy ? atDemoData(state).get().playBlockResponseForTrophy[blockID] : atDemoData(state).get().playBlockResponse[blockID];
  state = OpsProblem.setSharedProblems(state, response.instructionsProblems, response.result);
  return state;
}), AT.PLAY_STUDENT_TUTORIAL_BLOCK_REQUEST, function (vault, state, action) {
  return atTutorialBlock(state).canCreate().withDefault(LoadState.loadInit({})).set(function (oldValue) {
    if (!state.connected) return LoadState.loadError(oldValue, "E_NOT_CONNECTED");
    return LoadState.loadStart(oldValue, function () {
      return vault.api.playStudentTutorialBlock();
    });
  });
}), AT.PLAY_STUDENT_TUTORIAL_BLOCK_SUCCESS, function (vault, state, action) {
  var response = action.data;
  var user = atUser(state).get();
  var blockModel = APIFormat.convertMiscBlock("tutorial", response.block, {
    gradeNumber: OpsUser.getUserGrade(user)
  });
  // Parameter expected by OpsResult.iniForBlock for setting the block's styleType
  _.extend(response, {
    isTutorial: true
  });
  state = OpsProblem.setSharedProblems(state, response.instructionsProblems, response.result);
  state = atTutorialBlock(state).canCreate().set(function (block) {
    block = LoadState.loadSuccess(block);
    block = setIn(block, "model", blockModel);
    block = extendIn(block, "model", InstructionsUtil.processBlockInstructions(response.block, response.block.setList, response.instructionsProblems));
    block = setIn(block, "blockID", block.model.blockID);
    block = setIn(block, "currentResult", OpsResult.initForBlock(response, block.model, vault.clock));
    return block;
  });
  state = atTutorial(state).setIn("isResumed", response.result.percentComplete !== 0.0);
  return state;
}), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_actionHandlers, AT.PLAY_STUDENT_TUTORIAL_BLOCK_FAIL, function (vault, state, action) {
  return atTutorialBlock(state).set(function (oldValue) {
    return LoadState.loadError(oldValue, action.error);
  });
}), AT.PLAY_DEMO_BLOCK, function (vault, state, action) {
  /**
   * NOTE: this only gets called when a user plays a specific block for the first time
   * because the loaded block model is saved to the user's storage after the initial load.
   */
  var blockID = action.blockID,
    isTrophy = action.isTrophy;
  var demoData = atDemoData(state).get();
  var response = isTrophy ? demoData.playBlockResponseForTrophy[blockID] : demoData.playBlockResponse[blockID];

  // First adding any received instructions problems into shared problems
  state = OpsProblem.setSharedProblems(state, response.instructionsProblems, response.result);

  // Then updating the block with the new result
  state = atBlock(state, blockID).set(function (b) {
    return startBlock(b, response, vault.clock, {
      forDemo: true
    });
  });
  if (TrainerPage.isOnBlock(atPage(state).get(), state, blockID)) {
    state = atPage(state).set(function (page) {
      return TrainerPage.fillProblemIndex(page, state);
    });
    var room = {
      blockID: response.block.id,
      chapterID: response.block.chapterID,
      isTrophy: isTrophy,
      completed: response.result.percentComplete === 1
    };
    state = atPageUser(state).set(function (u) {
      return OpsUser.updateLastPlayedDataWithRoom(u, room);
    });
    if (!action.problemsData) {
      // TODO: Why does review need to not do the syncToPage call?
      state = atCurrResult(state).set(function (res) {
        return OpsResult.syncToPage(res, atPage(state).get(), vault.clock);
      });
    }
  }
  return state;
}), AT.REPLAY_DEMO_BLOCK, function (vault, state, action) {
  var blockIDToReplay = action.blockID ? action.blockID : atDemo(state).getIn(["actions", "replayLesson"]);
  var result = atBlock(state, blockIDToReplay).getIn("currentResult");
  if (!result) {
    ResultBanvas.resetAll();
    state = atPage(state).set(URLMake.state.forDemo(_.extend({}, URLMake.state.forBlock(atBlock(state, blockIDToReplay).get()), {
      problemIndex: 0
    })));
  } else {
    var problemIndex = 0;
    _.forEach(result.problems, function (problem, i) {
      if (problem.started) problemIndex = i;else return false;
    });
    state = atPage(state).set(URLMake.state.forDemo(_.extend({}, URLMake.state.forBlock(atBlock(state, blockIDToReplay).get()), {
      problemIndex: problemIndex
    })));
  }
  state = atDemo(state).setIn("showing", null);
  return state;
}), AT.BLOCK_HISTORY_REQUEST, function (vault, state, action) {
  return atBlock(state, action.blockID).setIn("history", function (oldValue) {
    if (!state.connected) return LoadState.loadError(oldValue, "E_NOT_CONNECTED");
    return LoadState.loadStart(oldValue, function () {
      return vault.api.loadHistory(action.blockID);
    });
  });
}), AT.BLOCK_HISTORY_SUCCESS, function (vault, state, action) {
  var response = action.data;
  if (response.instructionsProblems) {
    // First adding any received instructions problems into shared problems
    state = OpsProblem.setSharedProblems(state, response.instructionsProblems);
  }
  state = atBlock(state, action.payload.blockID).set(function (block) {
    var history = LoadState.loadSuccess(block.history);
    var results = response.results.map(function (r) {
      return OpsResult.initForHistory(r, block.model, response.lastCompletedResultID);
    });
    block = setIn(block, "history", history);
    block = extendIn(block, "history", {
      allResults: results,
      isMostRecentResultBroken: response.isMostRecentResultBroken,
      lastCompletedResultID: response.lastCompletedResultID
    });
    block = extendIn(block, "model", InstructionsUtil.processBlockInstructions(response.block, response.block.setList, response.instructionsProblems));
    return block;
  });
  return state;
}), AT.BLOCK_HISTORY_FAIL, function (vault, state, action) {
  return atBlock(state, action.payload.blockID).setIn("history", function (oldValue) {
    return LoadState.loadError(oldValue, action.error);
  });
}), AT.CLEAR_VIDEO_INTERVENTION, function (vault, state, action) {
  state = atPage(state).setIn("videoIntervention", false);
  vault.emitEvent("clearVideoIntervention", action.play);
  return state;
}), AT.UPDATE_RESULT_SUCCESS, function (vault, state, action) {
  var response = action.data;
  var payload = action.payload;
  state = atResultBySource(state, payload.resultSource).set(function (result) {
    if (!result) {
      return result;
    }
    result = OpsResult.setUpdateSuccess(result);
    result = OpsResult.clearSavedTrials(result, payload);

    // reviewProblems only exists for review blocks
    if (response.reviewProblems) {
      result = _.clone(result);
      var processedReviewProblems = OpsResult.processReviewProblems(response.reviewProblems);
      if (result.needsNextProblemType && payload.trial.problemID === _.nth(result.problems, -3).problemID) {
        result.problems = _.concat(result.problems.slice(0, -1), processedReviewProblems[result.needsNextProblemType]);
        result.needsNextProblemType = false;
      } else {
        result.nextProblemCorrect = processedReviewProblems.nextProblemCorrect;
        result.nextProblemIncorrect = processedReviewProblems.nextProblemIncorrect;
      }
    }
    return result;
  });
  return state;
}), AT.UPDATE_RESULT_FAIL, function (vault, state, action) {
  var payload = action.payload;
  var resultID = payload.result.id;
  var lastFail = payload.lastFail;
  var resultSource = payload.resultSource;
  if (atUser(state).getIn("sessionExpired")) {
    // The session has expired. No need to respond to update failures. Fixed
    // http://bugs.aops.com/T4984.
  } else if (!atResultBySource(state, resultSource).get()) {
    // Result was cleared, by logout or otherwise. Ignore this failure.
  } else if (action.error === "E_TOO_MANY_REQUESTS") {
    state = atResultBySource(state, resultSource).set(function (result) {
      return OpsResult.stopSaving(result);
    });
  } else if (action.error === "E_SUBMIT_TOKEN_MISMATCH") {
    state = atResultBySource(state, resultSource).set(function (result) {
      return OpsResult.stopSaving(result);
    });
    // TODO: remove when RR is done filming EN-4138
    var user = atUser(state).get();
    if (user.userID === 1163) {
      // eslint-disable-next-line no-console
      console.log("overriding error message");
      // eslint-disable-next-line no-console
      console.log({
        userID: user.userID,
        payload: payload,
        result: payload.result,
        lastFail: lastFail,
        resultSource: resultSource
      });
    } else {
      vault.emitEvent("showMessage", "resultRefresh", {
        refreshOnClose: true
      });
    }
  } else if (action.error === "E_RESULT_SET_MARKED_BROKEN" || action.error === "E_RESULT_SET_LIST_MARKED_BROKEN") {
    state = atResultBySource(state, resultSource).set(function (result) {
      return OpsResult.stopSaving(result);
    });
    var onCloseDispatch = {
      type: AT.REPLAY_BLOCK,
      blockID: atCurrBlock(state).getIn("blockID"),
      resultSourceType: resultSource.type
    };
    vault.emitEvent("showMessage", "currentResultForBrokenSetDeleted", {
      onCloseDispatch: onCloseDispatch,
      isTrophy: resultSource.type === "trophy"
    });
  } else {
    var currentResult = atCurrResult(state).get();
    var isCurrent = currentResult && currentResult.resultID === resultID;
    var wasBroken = false;
    var isBroken = false;
    state = atResultBySource(state, resultSource).set(function (result) {
      wasBroken = result.isBroken;
      result = OpsResult.handleError(result, action.error, lastFail, vault.clock, vault.dispatchAfter);
      isBroken = result.isBroken;
      return result;
    });
    var blockCR = atBlockByResultSource(state, resultSource);
    if (!wasBroken && isBroken && blockCR.exists()) {
      var blockName;
      state = blockCR.set(function (b) {
        blockName = b.model && b.model.displayName;
        b = OpsBlock.clearResult(b, resultSource.type);
        b = setIn(b, ["model", "underConstruction"], true);
        return b;
      });
      vault.emitEvent("showMessage", "resultFailed", {
        isCurrent: isCurrent,
        blockName: blockName
      });
      if (isCurrent) {
        state = atPage(state).set(function (page) {
          return OpsPage.leaveProblem(page);
        });
      }
    }
  }
  return state;
}), AT.RETRY_UPDATE_RESULT, function (vault, state, action) {
  var result = atResultBySource(state, action.resultSource).get();
  if (result && OpsResult.canRetryUpdate(result, vault.clock, action.lastFailTime)) {
    ResultSync.saveResultNow(result, state, vault.storage, vault.api, vault.clock, vault.throttler);
  }
  return state;
}), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_actionHandlers, AT.CONFIRM_RESET_PROBLEM, function (vault, state, action) {
  vault.emitEvent("confirmResetProblem");
  return state;
}), AT.REPLAY_PROBLEM, function (vault, state, action) {
  vault.emitEvent("readAloudCancel");
  state = atCurrProblem(state).set(function (problem) {
    return OpsProblem.replayProblem(problem);
  });
  var result;
  state = atCurrResult(state).set(function (res) {
    res = OpsResult.replayProblem(res);
    result = res;
    return res;
  });
  if (!state.page.demo) {
    ResultSync.queueSave(result, state, vault.throttler);
  }
  return state;
}), AT.START_TEST, function (vault, state, action) {
  var block = action.block;
  state = atUser(state).setIn(["model", "enteringTest"], block.model.chapterID);
  state = atPage(state).set(function (p) {
    return URLMake.state.forBlock(block);
  });
  return state;
}), AT.START_BOOK_TEST, function (vault, state, action) {
  var bookHash = action.bookHash;
  state = atPage(state).set(function (p) {
    return URLMake.state.forBookTest(bookHash);
  });
  return state;
}), AT.VIEW_TEST_HISTORY, function (vault, state, action) {
  var block = action.block;
  var newPageState = URLMake.state.forBlockHistory(block.model);
  newPageState.problemIndex = "history";
  state = atPage(state).set(function (p) {
    return newPageState;
  });
  return state;
}), AT.SAVE_TEST_ANSWER, function (vault, state, action) {
  //Marks trial state as saved (for use in test blocks) and makes engine not interactive
  //Only allowed to save if trial is allowed to submit.

  //Do all the initial checks submit trial would do.
  if (!state.connected) {
    vault.emitEvent("showMessage", "disconnected");
    return state;
  }

  //Mark problem as saved
  var submission;
  state = atCurrProblem(state).set(function (problem) {
    problem = action.customState ? OpsProblem.saveTrialState(problem, action.customState) : problem;
    if (action.isDebugSubmission) {
      submission = OpsProblem.debugSaveAnswer(problem, action.forceIsCorrect);
    } else {
      var result = atCurrResult(state).get();
      submission = OpsProblem.saveAnswer(problem, result, vault.clock, action.currentTrialAns, action.forceSave);
    }
    return submission.newProblem;
  });
  var newProblem = submission.newProblem;
  if (!submission.canSubmit) {
    vault.emitEvent("trialCannotSubmit", {
      partsToReact: submission.partsToReact
    });
    if (newProblem.confirmMessage) {
      vault.sounds.playSound("button-click");
      vault.emitEvent("confirmMessage", {
        message: newProblem.confirmMessage
      });
    } else if (submission.newProblem.sliderMessage) {
      vault.emitEvent("problemSliderMessage", {
        problem: submission.newProblem,
        message: submission.newProblem.sliderMessage
      });
    }
    vault.sounds.playSound("headmaster-popin");
  } else {
    state = goToNextProblem(state, vault.clock, vault.emitEvent);
    vault.sounds.playSound("button-click");
  }
  if (!state.page.demo) {
    var result = atCurrResult(state).get();
    ResultSync.queueSave(result, state, vault.throttler);
  }
  return state;
}), AT.QUIT_TEST_BLOCK_REQUEST, function (vault, state, action) {
  if (!state.connected) {
    vault.emitEvent("showMessage", "disconnected");
    return state;
  }
  var block = atBlock(state, action.blockID).get();
  var testInProgress = atUser(state).getIn(["model", "lastPlayedData", "testInProgress"]);
  // if trying to quit a block that doesn't exist or you're not currently in a test,
  // do nothing
  if (!block || !testInProgress) {
    return state;
  }
  state = atUser(state).setIn(["model", "lastPlayedData"], function (lpd) {
    return _.omit(lpd, ["testInProgress"]);
  });
  vault.api.quitBlock(block.blockID);
  return state;
}), AT.QUIT_TEST_BLOCK_SUCCESS, function (vault, state, action) {
  var blockID = action.payload.blockID;
  var result = action.data.result;
  if (!result) {
    var frontEndResult = atCurrResult(state).get();
    ErrorUtil.log("E_EMPTY_RESULT_QUIT_TEST", "The result returned by quitByBlockID was " + result + ". Using front end time to calculate cooldown expiration instead.", frontEndResult);
  }
  state = atBlock(state, blockID).set(function (b) {
    b = OpsBlock.clearResult(b, "block");
    if (!b.model.ignoreCooldown) {
      b.model.progressLock = "locked";
      b.model.progressLockSource = "cooldown";
      if (b.model.lockOverride !== "unlocked") {
        b.model.unlocked = false;
      }
    }
    b.model.hasHistory = true;
    b.model.testCooldownReason = "quit";
    var finishTime = !result ? moment() : moment.utc(result.finishedAt).utcOffset(result.finishedAtTZ * 60);
    b.model.testCooldownExpiration = TimeFormat.getDateTimeString(finishTime.add(Constants.TEST_QUIT_COOLDOWN_DAYS, "days"));
    return b;
  });
  var block = atBlock(state, blockID).get();
  state = clearBlockHistory(state);
  state = atPage(state).set(function (page) {
    return URLMake.state.forChapterFromBlock(block);
  });
  return state;
}), AT.QUIT_TEST_BLOCK_FAIL, function (vault, state, action) {
  var blockID = action.payload.blockID;
  return atBlock(state, blockID).set(function (b) {
    return LoadState.loadError(b, action.error);
  });
}), AT.START_TEST_PART_2, function (vault, state, action) {
  var emitEvent = vault.emitEvent;
  if (!state.connected) {
    emitEvent("showMessage", "disconnected");
    return state;
  }
  var result = atCurrResult(state).get();
  var firstProblemIndex = _.first(OpsResult.getProblemRangeForTestPart(result, 2));
  state = atCurrResult(state).extend({
    currentProblemIndex: firstProblemIndex,
    isOnFinal: false,
    showTestPart1Decision: false,
    hasSeenTestPart2: true
  });
  state = atCurrResult(state).set(function (res) {
    return ResultManager.markCurrentAsStarted(res, vault.clock.now());
  });
  emitEvent("clearDrawvas");
  state = updatePageAndHistory(state, emitEvent, function (page) {
    return TrainerPage.syncToResult(page, atCurrResult(state).get());
  });
  return state;
}), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_actionHandlers, AT.SUBMIT_TEST, function (vault, state, action) {
  if (!state.connected) {
    vault.emitEvent("showMessage", "disconnected");
    return state;
  }
  var result = atCurrResult(state).get();
  var testPart = action.part;

  // Update all the problems
  var blockModel = atCurrBlock(state).getIn("model") || {};

  // Calculate things that affect trial XP.
  var isThrottled = OpsBlock.isThrottled({
    model: blockModel
  });
  var maxXP = OpsBlock.calculateMaxXP({
    model: blockModel
  });
  var blockXP = blockModel.xp || 0;
  var xpToAdd = 0;
  state = atCurrResult(state).set(function () {
    // Update only the currently relevant problems
    var currentProblems = OpsResult.getCurrentProblemRangeForTest(result);
    result.problems.forEach(function (problem, i) {
      if (OpsUser.hasTeacherRole(state.user)) {
        // for teacher, don't update part 2 problems when submitting part 1, but
        // if submitting part 2, update the part 1 problems to submit everything
        if (testPart === 1 && !_.includes(currentProblems, i)) return;
      } else {
        // don't update problems in other part of the test
        if (!_.includes(currentProblems, i)) return;
      }
      var submission;
      result = setIn(result, ["problems", i], function () {
        problem = _.extend({}, problem, {
          started: problem.started || vault.clock.now()
        });
        submission = OpsProblem.submitTrial(problem, result, vault.clock, {
          answer: problem.customState.trial,
          forceSubmit: true //TODO: change for dev tools
        });
        problem = submission.newProblem;
        return problem;
      });
      if (submission.madeTrial) {
        result = OpsResult.queueTrialForSave(result, problem, vault.clock);
      }
      if (problem.outcome === "correct") {
        xpToAdd += OpsResult.getTrialXP(result, {
          isThrottled: isThrottled,
          maxXP: maxXP,
          blockXP: blockXP + xpToAdd
        });
      }
    });
    return result;
  });
  if (xpToAdd > 0) {
    state = atUser(state).set(function (u) {
      return OpsUser.addXP(u, xpToAdd);
    });
  }
  result = atCurrResult(state).get();
  if (testPart === 1) {
    // fail with 0 stars or move to decision page
    var potentialStars = OpsResult.getStars(result);
    if (potentialStars === 0 && result.resultType !== "bookTest") {
      state = atCurrResult(state).extend({
        testComplete: true,
        showSummary: true,
        showOverview: false
      });
      state = atUser(state).extendIn(["model", "lastPlayedData"], {
        testInProgress: null
      });
    } else {
      vault.sounds.playSound("headmaster-passpart1");
      state = atCurrResult(state).extend({
        showTestPart1Decision: true,
        showOverview: true,
        showSummary: false
      });
    }
  } else {
    state = atCurrResult(state).extend({
      showSummary: true,
      showOverview: false
    });
    state = atUser(state).extendIn(["model", "lastPlayedData"], {
      testInProgress: null
    });
  }
  result = atCurrResult(state).get();

  // Things to do when finishing up the block, needs to happen before saving the trial.
  state = saveCurrentResultNow(state, vault, {
    checkFinished: true
  });
  if (action.isDebugSubmission) {
    state = atCurrResult(state).set(function (res) {
      return OpsResult.goToFinal(res);
    });
    result = atCurrResult(state).get();
    state = updatePageAndHistory(state, vault.emitEvent, function (page) {
      return TrainerPage.syncToResult(page, result);
    });
  } else {
    state = atPage(state).set(function (page) {
      return TrainerPage.syncToResult(page, result);
    });
  }
  return state;
}), AT.SKIP_TEST_PART_2, function (vault, state, action) {
  if (!state.connected) {
    vault.emitEvent("showMessage", "disconnected");
    return state;
  }
  var result = atCurrResult(state).get();
  state = atCurrResult(state).extend({
    testComplete: true,
    showSummary: true
  });
  state = atUser(state).extendIn(["model", "lastPlayedData"], {
    testInProgress: null
  });
  result = atCurrResult(state).get();

  // Things to do when finishing up the block, needs to happen before saving
  // the trial.
  state = saveCurrentResultNow(state, vault, {
    checkFinished: true
  });
  state = atPage(state).set(function (page) {
    return TrainerPage.syncToResult(page, result);
  });
  return state;
}), AT.SWITCH_TO_TEST_PART, function (vault, state, action) {
  var part = action.part;
  state = atCurrResult(state).set(function (r) {
    if (part === 2) r = _.extend({}, r, {
      hasSeenTestPart2: true
    });
    r = _.extend({}, r, {
      isOnFinal: false,
      currentProblemIndex: TrainerCore.getProblemRangeForTestPart(r, part)[0]
    });
    r = ResultManager.markCurrentAsStarted(r, vault.clock.now());
    return r;
  });
  var result = atCurrResult(state).get();
  state = atPage(state).set(function (page) {
    return URLMake.state.forProblem(result, result.currentProblemIndex);
  });
  return state;
}), AT.REVIEW_QUIT_CHOICE, function (vault, state, action) {
  if (action.willQuit) {
    var mixpanelProperties = {
      block_id: result.source.blockID,
      chapter_id: result.source.chapterID,
      block_type: result.source.blockType,
      block_name: result.source.blockName,
      problem_index: result.currentProblemIndex,
      stars_at_quit: OpsResult.getStars(result),
      percent_complete: OpsResult.getPercentComplete(result)
    };
    Mixpanel.track(TRAINER_ACTIVITY_EVENTS.TrainerQuit, mixpanelProperties);
    var result;
    state = atCurrResult(state).set(function (res) {
      result = _.clone(res);
      result.isDisplayingQuitOption = false;
      result.hasQuit = true;
      //Remove the next problem added in post processing
      result.problems = result.problems.slice(0, -1);
      //Make sure not to load in any new problems (if updates were slow)
      result.needsNextProblemType = false;
      return result;
    });
    //If they chose to quit, do extra processing for the finishing and save
    state = saveCurrentResultNow(state, vault, {
      checkFinished: true
    });
  } else {
    state = atCurrResult(state).setIn("isDisplayingQuitOption", false);
    state = goToNextProblem(state, vault.clock, vault.emitEvent);
  }
  return state;
}), AT.SUBMIT_TRIAL, function (vault, state, action) {
  // hideSubmit engines, like laser maze, really need this action to go
  // through. See T13138.
  if (!state.connected && !action.fromStateChange) {
    vault.emitEvent("showMessage", "disconnected");
    return state;
  }
  vault.emitEvent("readAloudCancel");
  var result = atCurrResult(state).get();
  if (action.isDebugSubmission && (!result || result.showSummary)) {
    // eslint-disable-next-line no-console
    console.log("Could not debug-do the problem. " + "The result either didn't exist or is already complete.");
    return state;
  }

  //Submitting the problem
  var submission;
  var problem;
  var debugSubmissionError;
  state = atCurrProblem(state).set(function (p) {
    if (action.isDebugSubmission) {
      debugSubmissionError = OpsProblem.hasDebugSubmitError(p);
      if (debugSubmissionError) {
        return p;
      }
      if (!_.has(action, "currentTrialAns")) {
        action.currentTrialAns = p.customState && p.customState.trial;
      }
    }
    if (action.customState) {
      p = OpsProblem.saveTrialState(p, action.customState);
    }
    if (_.has(action, "forceIsCorrect")) {
      submission = OpsProblem.debugSubmitTrial(p, action.forceIsCorrect, vault.clock);
    } else {
      submission = OpsProblem.submitTrial(p, result, vault.clock, {
        answer: action.currentTrialAns,
        botTrials: action.botTrials,
        forceSubmit: action.forceSubmit,
        giveUp: action.giveUp
      });
    }
    problem = submission.newProblem;
    return problem;
  });
  //Skip out here if debug submitting for the problem cannot occur
  if (debugSubmissionError) {
    // eslint-disable-next-line no-console
    console.log(debugSubmissionError);
    return state;
  }
  //TODO: Marking previous submission.madeTrial check and trial queueing

  result = atCurrResult(state).get();
  var previousResult = result;
  var neverSetOutcome = ResultManager(result).neverSetOutcome;
  // Add XP and any other user changes.
  if (submission.isCorrect) {
    if (!state.page.demo && !OpsPage.isInStudentTutorial(state.page) && !result.limitStarsUntil) {
      var blockModel = {};
      if (state.page.name === "trainer.problem") {
        blockModel = atCurrBlock(state).getIn("model");
      } else if (state.page.name === "lab.problem") {
        blockModel = atCurrLabBlock(state).getIn("model");
      }

      // Calculate things that affect trial XP.
      var isThrottled = OpsBlock.isThrottled({
        model: blockModel
      });
      var maxXP = OpsBlock.calculateMaxXP({
        model: blockModel
      });
      var blockXP = blockModel.xp || 0;
      state = atUser(state).set(function (u) {
        return OpsUser.addXP(u, OpsResult.getTrialXP(result, {
          isThrottled: isThrottled,
          maxXP: maxXP,
          blockXP: blockXP
        }));
      });
    }
    // Play sound for correct answers on problems, including on drill problems with neverSetOutcome: true
    vault.sounds.playSound("solution-correct");
  }

  // Special result behavior
  var stars;
  var earnedNewStar = false;
  var reviewQuitMessageData = null;
  var showReviewStreakDropMessage = false;
  var trophyFinished = false;
  var skipIntervention = OpsUser.hasKey(state.user, "trainer no interventions") || state.page.demo;

  //Only do the following if a submission actually occurred
  if (problem.lastTrialAccepted) {
    var processor = OpsProblem.getProcessor(problem);
    state = atCurrResult(state).set(function (res) {
      result = ResultManager.processPostSubmission(res, processor, false);
      return result;
    });
    if (neverSetOutcome && ResultManager.isFinished(result)) {
      state = atCurrProblem(state).extend({
        outcome: "finished",
        sliderMessage: null
      });
    }
    if (ResultManager(result).neverResumeResult) {
      var blockID = result.source.blockID;
      if (blockID) {
        // Update hasHistory flag for these results in case user leaves block
        state = atBlock(state, blockID).setIn(["model", "hasHistory"], true);
      }
    }
    //The above two statements can update the problem and its outcome, so we update
    //problem to be the newest version.
    problem = atCurrProblem(state).get();
    if (processor.settings.continuousPlay) {
      // we pass the new custom state through the event since we can't guarantee
      // Problem.jsx has rerendered (received the updated problem state) before
      // the event handler is triggered.
      vault.emitEvent("trialStateUpdate", {
        customState: problem.customState
      });
    }
    //Check if there needs to be an intervention
    if (ResultManager.shouldIntervene(result) && !skipIntervention) {
      state = atCurrResult(state).extend({
        hasIntervened: true,
        hasSeenInterventionMessage: false
      });
      var mixpanelProperties = {
        block_id: result.source.blockID,
        chapter_id: result.source.chapterID,
        block_type: result.source.blockType,
        block_name: result.source.blockName,
        problem_index: result.currentProblemIndex,
        stars_earned_so_far: result.starsEarnedSoFar,
        streak_score: result.streakScore,
        percent_complete: OpsResult.getPercentComplete(result),
        stars_at_intervention: result.starsEarnedSoFar
      };
      Mixpanel.track(TRAINER_ACTIVITY_EVENTS.LessonIntervened, mixpanelProperties);
      // Clear block history so it can reload with new results
      state = clearBlockHistory(state);
      var _blockID = result.source.blockID;
      state = atBlock(state, _blockID).set(function (block) {
        var newBlockModel = _.clone(block.model);
        //Adding this intervention to the history
        newBlockModel.recentHistory = setIn(newBlockModel.recentHistory, [block.model.recentHistory.length - 1, "finishStatus"], "intervened");
        newBlockModel.hasHistory = true;
        return setIn(block, "model", newBlockModel);
      });
    }
    // Check if the number of prospective stars the user earned has increased to play the appropriate sound effect.
    stars = OpsResult.getStars(result);
    if (!neverSetOutcome && stars > result.prospectiveStarsEarnedSoFar) {
      state = atCurrResult(state).setIn("prospectiveStarsEarnedSoFar", stars);
      result = atCurrResult(state).get();
      vault.sounds.playSound("stars-" + stars);
    }
    //Checking if this submission earned any new stars
    if (ResultManager(result).canEarnStarsOnTrialSubmission) {
      if (stars > result.starsEarnedSoFar) {
        state = atCurrResult(state).setIn("starsEarnedSoFar", stars);
        result = atCurrResult(state).get();
        earnedNewStar = true;
      }
    }

    // Happy sounds for fill drill when a problem is answered correctly
    // TODO: we probably want a custom sound for this.  preferably happy fish sounds
    if (_.isNull(problem.outcome) && problem.lastTrialOutcome === "correct" && result.resultType === "fillDrill") {
      vault.sounds.playSound("solution-correct");
    }

    // Play a sound when they get a problem wrong; don't play sound on drill problems.
    if (!neverSetOutcome) {
      if (problem.outcome === "incorrect") {
        vault.sounds.playSound("solution-incorrect");
      } else if (_.isNull(problem.outcome) && problem.lastTrialOutcome === "incorrect") {
        if (OpsResult.isTutorial(result)) {
          vault.sounds.playSound("headmaster-cyw-1");
        } else if (result.styleType === "test") {
          vault.sounds.playSound("rote-incorrect-1");
        } else {
          vault.sounds.playSound(result.styleType + "-incorrect-1");
        }
      }
    }
    //If this is a review block and they just got a problem wrong,
    //check if it's at the point where we want to give them the option to quit
    //or inform them about their streak dropping.
    if (result.resultType === "review" && problem.outcome === "incorrect") {
      if (result.lastQuitOptionInfo && result.lastQuitOptionInfo.stars === result.starsEarnedSoFar) {
        //They've already been given the option to quit, haven't gotten a new star, and got another problem wrong.
        //Kick them out.
        state = atCurrResult(state).set(function (res) {
          return extendIn(res, [], {
            hasQuit: true,
            needsNextProblemType: false,
            problems: res.problems.slice(0, -1)
          });
        });
        reviewQuitMessageData = {
          forForcedQuit: true
        };
      } else if (result.problems.length > result.problemsBeforeQuitOption && !result.lastQuitOptionInfo || result.lastQuitOptionInfo && result.lastQuitOptionInfo.stars < result.starsEarnedSoFar) {
        //If they've gotten their first problem wrong past problemsBeforeQuitOption (so haven't had the option yet)
        //or if they were given the option and have earned a new star since but got another problem wrong,
        //give them the option to quit.
        state = atCurrResult(state).set(function (res) {
          return extendIn(res, [], {
            lastQuitOptionInfo: {
              stars: res.starsEarnedSoFar,
              index: result.currentProblemIndex
            },
            isDisplayingQuitOption: true
          });
        });
        reviewQuitMessageData = {
          forQuitOption: true,
          numProblems: OpsResult.getReviewProblemsLeftBeforeNextStar(result)
        };
      }
      //Check if this is the the first time their streak has dropped since earning a star (and there is no quit message)
      if (!reviewQuitMessageData && previousResult.starsEarnedSoFar && !result.hasSeenDroppedStreakMessage) {
        showReviewStreakDropMessage = result.streakScore < previousResult.streakScore;
        if (showReviewStreakDropMessage) {
          state = atCurrResult(state).setIn("hasSeenDroppedStreakMessage", true);
        }
      }
    }
    if (result.resultType === "trophy" && problem.outcome) {
      vault.sounds.playSound(result.styleType + "-trophy");
      trophyFinished = true;
    }
    //TODO: New location of submission.madeTrial check and trial queueing
    //Needs to be after the processPostSubmission, moved here to be right
    //before the actual trial saving. Should be okay in this branch since
    //lastTrialAccepted is always true if madeTrial is true. (They seem to
    // be only different in a case for test results.)
    if (submission.madeTrial) {
      state = atCurrResult(state).set(function (res) {
        return OpsResult.queueTrialForSave(res, problem, vault.clock);
      });
    }
    state = saveCurrentResultNow(state, vault, {
      checkFinished: true,
      earnedNewStar: earnedNewStar,
      hasTrial: true
    });

    //Clearing the time spent on the problem after submitting
    state = atCurrProblem(state).set(function (p) {
      return OpsProblem.resetTrialTiming(p, vault.clock);
    });
  } else {
    //TODO: We should log incomplete submissions:
    // -canSubmit being false for some reason
    // -not enough time to give up
    // -problem limits attempt time
    // etc.
  }

  // Events
  var message;
  if (earnedNewStar && ResultManager(result).showMessageOnStarEarned) {
    message = OpsResult.getStarEarnedMessage(result, stars, state.user.model && state.user.model.displayName);
    if (message) {
      vault.emitEvent("earnedNewStar", {
        stars: stars,
        message: message
      });
    }
  }
  if (showReviewStreakDropMessage) {
    vault.emitEvent("reviewStreakDrop");
  }
  if (reviewQuitMessageData) {
    vault.emitEvent("reviewQuitMessage", reviewQuitMessageData);
  }
  if (problem.sliderMessage) {
    vault.emitEvent("problemSliderMessage", {
      problem: problem,
      message: problem.sliderMessage
    });
  }
  if (trophyFinished) {
    var username = OpsUser.getUserName(state.user, state.page);
    message = OpsResult.getSummaryMessage(result, username);
    vault.emitEvent("trophyFinished", {
      message: message
    });
  }
  if (problem.confirmMessage) {
    vault.sounds.playSound("button-click");
    vault.emitEvent("confirmMessage", {
      message: problem.confirmMessage,
      giveUpConfirm: problem.giveUpConfirm
    });
  }
  if (problem.outcome) {
    vault.emitEvent("clearDrawvas");
    // Preload solution audio when problem is completed
    preloadReadAloudForSolution(state, vault.emitEvent);
  }
  vault.emitEvent("trialSubmitted", {
    lastTrialAccepted: problem && problem.lastTrialAccepted
  });
  if (!submission.canSubmit) {
    if (!problem.confirmMessage && _.includes(["fiona", "grok", "q", "kraken", "rote", "ms_levans", "lab"], result.styleType)) {
      vault.sounds.playSound(result.styleType + "-cyw-1");
    } else if (OpsResult.isTutorial(result)) {
      vault.sounds.playSound("headmaster-cyw-1");
    }
    //Something about their trial is not allowing them to submit. We should react to that
    vault.emitEvent("trialCannotSubmit", {
      partsToReact: submission.partsToReact
    });
  }
  if (FLAGS.cleanMode && FLAG_OPTIONS.cleanMode.appearance.solutions === "skip" && submission.isCorrect) {
    return goToNextProblem(state, vault.clock, vault.emitEvent);
  }
  return state;
}), AT.SAVE_TRIAL_STATE, function (vault, state, action) {
  var problem;
  var currProblemCursor = atCurrProblem(state);
  var currProblemID = currProblemCursor.getIn("problemID");
  if (currProblemID && !action.problemID) {
    ErrorUtil.log("E_PROBLEM_ID_MISSING_ON_SAVE_TRIAL_STATE", "No problem ID was found. Ensure the banvas engine assigns this.problem = props.problem in its " + "initialize function. Expected problem ID: " + currProblemID);
  } else if (currProblemID && currProblemID !== action.problemID) {
    // Don't save if problem ID on the banvas doesn't match the current problem ID
    // We've seen occasional cases where the trial from the wrong problem gets saved and breaks the page
    // See T21507
    ErrorUtil.log("E_TRIAL_SAVING_TO_WRONG_PROBLEM", "When attempting to save the trial state, the problem ID from the banvas view (" + action.problemID + ") did not match the problem ID from the vault state cursor (" + currProblemID + ").");
    return;
  }
  state = currProblemCursor.set(function (p) {
    problem = OpsProblem.saveTrialState(p, action.customState);
    return problem;
  });
  var result = atCurrResult(state).get();
  if (result) {
    // Unsave the result if a new trial is submitted (tests allow you to edit your answer, so we unsave
    // them when you edit them)
    if ((result.resultType === "test" || result.resultType === "bookTest") && currProblemCursor.getIn("saved")) {
      state = atCurrProblem(state).extend({
        saved: false
      });
    }
    var rm = ResultManager(result);
    if (rm.callPostSubmissionProcessingOnStateChange) {
      var processor = OpsProblem.getProcessor(problem);
      state = atCurrResult(state).set(function (res) {
        result = ResultManager.processPostSubmission(res, processor, true);
        return result;
      });
    }
    var earnedNewStar = rm.canEarnStarsOnStateChange && OpsResult.getStars(result) > result.starsEarnedSoFar;
    if (earnedNewStar) {
      state = atCurrResult(state).setIn("starsEarnedSoFar", OpsResult.getStars(result));
      result = atCurrResult(state).get();
    }
    if (rm.canFinishOnStateChange || earnedNewStar) {
      state = checkResultFinished(state, result, earnedNewStar, vault.clock, vault.emitEvent);
      result = atCurrResult(state).get();
    }
    if (action.checkIfComplete) {
      OpsProblem.dispatchTrialIfCorrect(problem, vault.dispatch);
    }
    if (earnedNewStar) {
      ResultSync.saveResultNow(result, state, vault.storage, vault.api, vault.clock, vault.throttler);
    } else if (!state.page.demo) {
      ResultSync.queueSave(result, state, vault.throttler);
    }
    if (rm.updatePercentCompleteOnStateChange) {
      var percentComplete = OpsResult.getPercentComplete(result);
      var resultUnfinished = !OpsResult.isFinished(result);
      state = atBlockByResultSource(state, result.source).set(function (block) {
        return OpsBlock.updatePercentCompletion(block, percentComplete, resultUnfinished);
      });
    }
    state = atPageUser(state).set(function (u) {
      return OpsUser.updateLastPlayedData(u, result);
    });
    // Update chapter path avatar location
    state = atChapterPath(state).set(function (cp) {
      return OpsChapterPath.updateAvatarOverrideContext(cp, {
        forLastPlayed: true
      });
    });
  }
  return state;
}), AT.CHANGE_TRIAL_STATE, function (vault, state, action) {
  var result = atCurrResult(state).get();
  if (ResultManager(result).noUndoRedoClear) {
    return state;
  }
  state = atCurrProblem(state).set(function (problem) {
    if (action.changeType === "reset") {
      return OpsProblem.saveTrialState(problem, {});
    } else if (action.changeType === "undo") {
      return OpsProblem.undoTrialState(problem);
    } else if (action.changeType === "redo") {
      return OpsProblem.redoTrialState(problem);
    }
  });
  // Unsave the result if a new trial is submitted (tests allow you to edit your answer, so we unsave
  // them when you edit them)
  if ((result.resultType === "test" || result.resultType === "bookTest") && atCurrProblem(state).getIn("saved")) {
    state = atCurrProblem(state).extend({
      saved: false
    });
  }
  result = atCurrResult(state).get();
  if (result && !state.page.demo) {
    ResultSync.queueSave(result, state, vault.throttler);
  }
  vault.emitEvent("trialStateUpdate", {
    customState: atCurrProblem(state).getIn("customState"),
    type: action.changeType
  });
  return state;
}), AT.REPLAY_BLOCK, function (vault, state, action) {
  var resultSrcType = action.resultSourceType || "block";
  if (resultSrcType === "block") {
    state = updatePageAndHistory(state, vault.emitEvent, function (page) {
      return setIn(page, "problemIndex", 0);
    });
  }
  state = atBlock(state, action.blockID).set(function (b) {
    return OpsBlock.clearResult(b, resultSrcType);
  });
  state = setFailUnlockFlag(state, action.blockID);
  return state;
}), AT.SET_DEV_PROBLEM, function (vault, state, action) {
  state = atPage(state).set(URLMake.state.forDevProblem("globallyProvided"));
  state = atDevProblem(state).set(function () {
    return OpsDevProblem.setProblemFromData(action.problemData, vault.clock);
  });
  return state;
}), AT.SET_ENGINE_TESTER_PROBLEM, function (vault, state, action) {
  // Same as SET_DEV_PROBLEM but for engine tester page, so no redirect
  state = atDevProblem(state).set(function () {
    return OpsDevProblem.setProblemFromData(action.problemData, vault.clock);
  });
  return state;
}), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_actionHandlers, AT.NEXT_PROBLEM, function (vault, state, action) {
  return goToNextProblem(state, vault.clock, vault.emitEvent);
}), AT.PREVIOUS_PROBLEM, function (vault, state, action) {
  var result;
  state = atCurrResult(state).set(function (res) {
    result = OpsResult.goToPreviousProblem(res, vault.clock);
    return result;
  });
  vault.emitEvent("clearDrawvas");
  state = updatePageAndHistory(state, vault.emitEvent, function (page) {
    return TrainerPage.syncToResult(page, result);
  });
  // Preload read aloud audio for the new problem
  preloadReadAloudForProblem(state, vault.emitEvent);
  return state;
}), AT.GOTO_FIRST_PROBLEM, function (vault, state, action) {
  var result;
  state = atCurrResult(state).set(function (res) {
    result = OpsResult.goToFirstProblem(res, vault.clock);
    return result;
  });
  vault.emitEvent("clearDrawvas");
  state = updatePageAndHistory(state, vault.emitEvent, function (page) {
    return TrainerPage.syncToResult(page, result);
  });
  return state;
}), AT.GOTO_LAST_PROBLEM, function (vault, state, action) {
  var result;
  state = atCurrResult(state).set(function (res) {
    result = OpsResult.goToLastProblem(res, vault.clock);
    return result;
  });
  vault.emitEvent("clearDrawvas");
  state = updatePageAndHistory(state, vault.emitEvent, function (page) {
    return TrainerPage.syncToResult(page, result);
  });
  return state;
}), AT.GOTO_FINAL, function (vault, state, action) {
  var result;
  state = atCurrResult(state).set(function (res) {
    result = OpsResult.goToFinal(res);
    return result;
  });
  state = updatePageAndHistory(state, vault.emitEvent, function (page) {
    return TrainerPage.syncToResult(page, result);
  });
  return state;
}), AT.GOTO_TEST, function (vault, state, action) {
  var props = action.props;
  var user = props.user,
    blockModel = props.blockModel;
  var chapterID = GradeChapter.toChapterID(blockModel.gradeNumber, blockModel.chapterIndex);
  var chapterContext = GradeChapter.chapterIDToContext(chapterID);
  if (OpsUser.hasTeacherRole(user) || OpsUser.hasKey(user, "trainer allow unfinished test")) {
    props.setURL(URLMake.forBlock({
      model: blockModel
    }));
  } else {
    vault.dispatch({
      type: AT.SHOW_CONFIRM,
      messageType: "startTest",
      data: {
        onConfirmDispatch: {
          type: AT.START_TEST,
          // the "block" in the props is the block model here
          block: {
            model: _.extend({}, blockModel, {
              blockType: "test",
              chapterID: chapterID
            })
          }
        },
        baLevel: chapterContext.gradeNumber,
        chapter: chapterContext.chapterIndex + 1,
        chapterName: chapterContext.name
      }
    });
  }
}), AT.SET_SHOW_INSTRUCTIONS, function (vault, state, action) {
  // T15194: This action in particular seems to be prone to defeating the
  // MisorderedDispatchFix, so enforce what pages it can run on.
  var page = state.page;
  if (!isDevProblemPage(page) && page.name !== "trainer.problem" && page.name !== "trainer.history" && page.name !== "lab.problem" && page.name !== "tutorial.main") {
    return state;
  }
  //Update the page to reflect whether or not instructions are open
  state = atPage(state).setIn("showInstructions", !!action.showInstructions);
  if (action.showInstructions) {
    // Close any slider messages that are open
    vault.emitEvent("closeSliderMessage");
  }
  //If the instructions were just closed, mark the current problem in the result as started
  if (!OpsPage.isHistoryPage(state.page)) {
    state = atCurrResult(state).set(function (result) {
      return ResultManager.markCurrentAsStarted(result, vault.clock.now());
    });
  }
  return state;
}), AT.ACKNOWLEDGE_INSTRUCTIONS_REVIEW, function (vault, state, action) {
  // remove force review
  state = atCurrResult(state).setIn("instructionsForceReview", false);
  // close message slider
  vault.emitEvent("closeSliderMessage");
  return state;
}), AT.SAVE_INSTRUCTIONS_STATE, function (vault, state, action) {
  var block = atCurrBlock(state).get();
  var problem = atCurrProblem(state).get();
  var problemIndex = atPage(state).getIn("problemIndex");
  var key = InstructionsUtil.isMiddleInstructions(block, problem, problemIndex) ? "instructionsMiddleState" : "instructionsState";
  //Save the state of the instructions in the result
  state = atCurrResult(state).setIn(key, action.customState);
  return state;
}), AT.INSTRUCTIONS_PROBLEM_CORRECT, function (vault, state, action) {
  vault.emitEvent("instructionsProblemCorrect");
}), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_actionHandlers, AT.REQUEST_SPECIFIC_SET, function (vault, state, action) {
  var result = atCurrResult(state).get();
  if (!result) {
    return state;
  }
  ResultSync.saveIgnoringSubmitToken(result, state, vault.storage, vault.api, vault.clock, vault.throttler);
  state = atCurrResult(state).set(function () {
    result = OpsResult.stopSaving(result);
    return result;
  });
  vault.api.requestSpecificSet(result.source.blockID, action.setNumber, action.originalSetID, action.forceResume, action.forceNewResult, result.resultType);
  if (action.forceNewResult) {
    var resultSourceType = _.get(result, "source.type");
    state = atCurrBlock(state).set(function (b) {
      return OpsBlock.clearResult(b, resultSourceType);
    });
    state = atPage(state).set(function (page) {
      return TrainerPage.setProblemIndex(page, 0);
    });
  }
  return state;
}), AT.DEBUG_FINISH_WITH_STARS, function (vault, state, action) {
  var previousResult = atCurrResult(state).get();
  if (!previousResult || previousResult.isComplete || previousResult.hasIntervened || previousResult.updateFails) {
    // eslint-disable-next-line no-console
    console.log("Cannot debug do result that doesn't exist, is finished, intervened, or failing to update.");
    return state;
  }
  var debugData;
  state = atCurrResult(state).set(function (res) {
    debugData = OpsResult.debugGetStars(res, vault.clock, action.numStars);
    return debugData.result;
  });
  var result = atCurrResult(state).get();
  if (result === previousResult) {
    // eslint-disable-next-line no-console
    console.log("Debug getting stars doesn't work on this type of block.");
    return state;
  }
  if (result.resultType === "test") {
    state = atUser(state).extendIn(["model", "lastPlayedData"], {
      testInProgress: null
    });
  }
  state = saveCurrentResultNow(state, vault, {
    checkFinished: true,
    earnedNewStar: debugData.earnedNewStar,
    hasTrial: true
  });
  if (debugData.needsPageChange) {
    state = atCurrResult(state).set(function (res) {
      return OpsResult.goToFinal(res);
    });
    result = atCurrResult(state).get();
    state = updatePageAndHistory(state, vault.emitEvent, function (page) {
      return TrainerPage.syncToResult(page, result);
    });
  }
  return state;
}), AT.DEBUG_UNLOCK_BLOCKS_IN_CURRENT_CHAPTER, function (vault, state, action) {
  var chapter = atCurrChapter(state).get();
  if (!chapter || !chapter.chapterID) {
    console.log("No current chapter to unlock."); // eslint-disable-line no-console
    return;
  }
  var chapterID = chapter.chapterID;
  //Updating all blocks in the chapter on the front end to be unlocked
  var blockIDsToUnlock = Derived.getAllChapterBlockIDs(state, chapterID);
  state = atBlocks(state).setKeys(blockIDsToUnlock, function (b) {
    return setIn(b, ["model", "unlocked"], true);
  });
  state = atChapter(state, chapterID).extendIn("model", {
    unlocked: true,
    gradeUnlocked: true
  });

  //Unlocking all blocks in the database as well
  vault.api.devUnlockBlocksInChapter(chapterID);
  return state;
}), AT.STUDENT_TUTORIAL_UPDATE_PROGRESS_REQUEST, function (vault, state, action) {
  var lastPart = atUser(state).getIn(["model", "eventsTriggered", "tutorials", "studentTutorial", "currentPart"]);
  var shouldUpdateProgress = true;
  if (_.startsWith(lastPart, "doLessonProblem") && _.startsWith(action.part, "doLessonProblem")) {
    shouldUpdateProgress = _.gt(action.part, lastPart);
  }
  if (shouldUpdateProgress || action.restart === true) {
    var totalTimesModalOpened = atTutorial(state).getIn("totalTimesModalOpened");
    vault.api.updateTutorialProgress(action.part, action.step, totalTimesModalOpened);
  }
  if (action.restart === true) {
    vault.api.playStudentTutorialBlock({
      restart: true
    });
    state = atTutorialProblemsWorkedOn(state).set([]);
  }
  state = atUser(state).setIn(["model", "eventsTriggered", "tutorials", "studentTutorial"], {
    currentPart: action.part,
    currentStep: action.step
  });
  if (action.restart === true) {
    state = atPage(state).setIn("problemIndex", null);
  }
  state = atTutorialCurrentPartName(state).set(action.part);
  state = atTutorialCurrentStepName(state).set(action.step);
  var page = atPage(state).get();

  // If the page they are on IS NOT the tutorial, send them there
  // This is to make sure they immediately go to the tutorial when
  // they hit the Restart Student Tutorial button from
  // the home page
  if (page.name !== "tutorial.main") {
    state = atPage(state).set(URLMake.state.forTutorial());
  }
  return state;
}), AT.STUDENT_TUTORIAL_UPDATE_PROGRESS_SUCCESS, function (vault, state, action) {
  // Nothing to do here...
}), AT.STUDENT_TUTORIAL_UPDATE_PROGRESS_FAIL, function (vault, state, action) {
  // Not sure what to do here...
  state = atTutorial(state).setIn("showCannotUpdateProgressModal", true);
  return state;
}), AT.USER_DISMISSED_NOTIFICATION_MODAL, function (vault, state, action) {
  state = atUser(state).setIn(["model", "eventsTriggered", "notifications", action.modalType], "shown");
  return state;
}), AT.UPDATE_CHAPTER_PATH_AVATAR, function (vault, state, action) {
  var context = action.context;
  state = atChapterPath(state).set(function (cp) {
    return OpsChapterPath.updateAvatarOverrideContext(cp, context);
  });
  return state;
}), AT.CLEAR_CHAPTER_PATH_ANIMATIONS, function (vault, state, action) {
  state = atChapterPath(state).set(function (cp) {
    return OpsChapterPath.clearAnimations(cp);
  });
  return state;
}), AT.DEBUG_SET_XP_REQUEST, function (vault, state, action) {
  if (state.page.demo) return state;
  // do nothing on demo
  vault.api.debugSetXP(action.newXPTotal, state.user.userID);
  return state;
}), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_actionHandlers, AT.DEBUG_SET_XP_SUCCESS, function (vault, state, action) {
  state = atUser(state).extendIn("model", {
    xp: action.data.xp
  });
  return state;
}), AT.DEBUG_SET_XP_FAIL, function (vault, state, action) {
  return state;
}), AT.DEBUG_RESET_LEVEL_NOTIFICATION_REQUEST, function (vault, state, action) {
  if (state.page.demo) return state;
  // do nothing on demo
  var userXP = state.user.model.xp;
  var level = Math.floor(Math.sqrt(userXP / 25));
  state = atUser(state).extendIn("model", {
    lastLevelNotified: level
  });
  vault.api.debugResetLevelNotification(state.user.userID, level);
  return state;
}), AT.DEBUG_RESET_LEVEL_NOTIFICATION_SUCCESS, function (vault, state, action) {
  return state;
}), AT.DEBUG_RESET_LEVEL_NOTIFICATION_FAIL, function (vault, state, action) {
  return state;
}));
var initDevProblem = function initDevProblem(vault, state) {
  var page = atPage(state).get();
  if (page.name === "trainer.devProblem") {
    state = atDevProblem(state).set(function () {
      var name = page.devProblemName;
      return OpsDevProblem.setProblemFromName(name, vault.storage, vault.clock);
    });
    OpsDevProblem.saveLocalResult(atCurrResult(state).get(), vault.storage, vault.clock);
  }
  return state;
};

//
// The post-update hooks
//

// Extra things for the SET_PAGE action to do when trainer code is loaded.
var augmentSetPage = function augmentSetPage(vault, oldState, newState, action) {
  if (action.type !== AT.SET_PAGE) {
    return newState;
  }
  newState = atPage(newState).set(function (p) {
    if (p && p.name === "lab.problem") {
      return TrainerPage.fillLabProblemIndex(p, newState);
    } else if (p && p.name === "tutorial.main") {
      return p;
    }
    return TrainerPage.fillProblemIndex(p, newState);
  });
  var page = atPage(newState).get();
  if (page.name === "trainer.problem" || page.name === "lab.problem") {
    vault.emitEvent("clearDrawvas");
  }
  var resultCR = atCurrResult(newState);
  if (resultCR.exists() && !OpsPage.isInStudentTutorial(page)) {
    newState = resultCR.set(function (result) {
      return OpsResult.syncToPage(result, page, vault.clock);
    });
  }
  newState = initDevProblem(vault, newState);

  // Preload read aloud audio when navigating to a problem page
  if (page.name === "trainer.problem" || page.name === "lab.problem") {
    preloadReadAloudForProblem(newState, vault.emitEvent);
  }
  return newState;
};
var validateTrainerPage = function validateTrainerPage(vault, oldState, newState, action) {
  if (globalThis.PLAY_PROBLEM_DATA) {
    return newState;
  }
  var page = atPage(newState).get();
  var user = atUser(newState).get();

  // Check for book test window
  var isBookTestPage = OpsPage.isPageForBookTestBlock(page);
  var currentlyAssignedBookTest = OpsUser.bookTestAssignedNow(user);
  var pageBookTestHash = isBookTestPage && page.bookTestHash;
  if (isBookTestPage && currentlyAssignedBookTest && currentlyAssignedBookTest.miscBlockName !== pageBookTestHash) {
    var bookTestHWInfo = _.get(user, "model.homework.bookTestInfo", []);
    var targetBookTest = _.find(bookTestHWInfo, function (t) {
      return t.miscBlockName === pageBookTestHash;
    });
    var testNormallyUnlocked = targetBookTest && targetBookTest.unlocked;
    vault.emitEvent("showMessage", "inBookTestWindowForOtherTest", {
      attemptingToAccessUnlockedBookTest: testNormallyUnlocked,
      scheduledTest: currentlyAssignedBookTest.miscBlockName.substring(8)
    });
    newState = atPage(newState).set(function (p) {
      return URLMake.state.forHomework();
    });
    return newState;
  }

  // On a locked block or chapter?
  var lockCode = TrainerPage.getTrainerLockCode(page, newState) || TrainerPage.getLabLockCode(page, newState);
  newState = atPage(newState).set(function (p) {
    return TrainerPage.checkTrainerLocks(p, newState);
  });
  newState = checkForUserLoadOnBadChapter(vault, oldState, newState, action);
  newState = checkForUserLoadOnBadLabType(vault, oldState, newState, action);

  //TODO: Maybe move this info into getTrainerLockCode. Perhaps it can return
  //an object with keys about whether or not to show a message and the code.
  if (lockCode) {
    vault.emitEvent("showMessage", lockCode, {});
  }
  // On entering a block's main set (non-trophy) check for various maxStar scenarios
  var oldChapter = page && oldState.user && atChapterByPage(oldState, page).get();
  var newChapter = page && user && atChapterByPage(newState, page).get();
  var onBlockWithLoadedChapter = newChapter && newChapter.load === "done" && TrainerPage.isOnBlockNonTrophy(page);
  var justEnteredChapter = TrainerPage.wouldEnterBlockNonTrophy(oldState.page, page) || !oldChapter || oldChapter.load !== "done";
  //If the current chapter is loaded (so we have data about block's maxStars) and either the user
  //just entered the block or is on a block and the chapter just loaded
  if (onBlockWithLoadedChapter && justEnteredChapter) {
    var block = atBlockByPage(newState, page).get();
    //First check if the block has maxStar limitations that have expired
    //and update if necessary
    var nowMoment = moment(vault.clock.now());
    if (block && OpsBlock.haveLimitedMaxStarsExpired(block, nowMoment)) {
      newState = atBlock(newState, block.blockID).extendIn("model", {
        starsAvailable: 3,
        limitedStarsExpiration: false
      });
      //Then use the updated block for calculations
      block = atBlockByPage(newState, page).get();
    }
    var noMaxStars = OpsUser.hasKey(user, "trainer no limited stars");
    var allowUnfinishedTest = OpsUser.hasKey(user, "trainer allow unfinished test");

    //Then check if a warning before or after entering is necessary
    if (noMaxStars && allowUnfinishedTest) {
      //All the following warning/locks don't apply for users without limited stars.
      return newState;
    } else if (OpsBlock.isInTestCooldown(block, nowMoment) && !FLAGS.bypassTestCooldown && !OpsUser.hasTeacherRole(user) && !block.model.lockOverride === "unlocked") {
      vault.emitEvent("showMessage", "testCooldown", {
        expiration: block.model.testCooldownExpiration,
        reason: block.model.testCooldownReason,
        user: user
      });
      return atPage(newState).set(function (p) {
        return OpsPage.leaveProblem(p);
      });
    } else if (!noMaxStars && OpsBlock.warnAboutMaxStarsBeforeEntering(block)) {
      //If they just confirmed the navigation, do nothing.
      if (action.type === AT.SET_PAGE && action.confirmed) {
        return newState;
      } else {
        //Pop a confirmation modal and route them back to the chapter page.
        vault.emitEvent("showConfirm", "enterLimitedStarBlock", {
          limitExpires: block.model.limitedStarsExpiration,
          onConfirmDispatch: {
            type: AT.SET_PAGE,
            pageState: page,
            confirmed: true
          }
        });
        return atPage(newState).set(function (p) {
          return OpsPage.leaveProblem(p);
        });
      }
    } else if (!noMaxStars && OpsBlock.warnAboutMaxStarsAfterEntering(block)) {
      //Pop an info modal letting them know they're playing a block with maxStars 1.
      vault.emitEvent("showMessage", "enteredLimitedStarBlock", {
        limitExpires: block.model.limitedStarsExpiration
      });
      return newState;
    } else if (!noMaxStars && OpsBlock.shouldCheckAboutDeletingLimitedResult(block)) {
      //If they just confirmed the navigation, do nothing.
      if (action.type === AT.SET_PAGE && action.confirmed) {
        return newState;
      } else {
        vault.emitEvent("showConfirm", "enterUnlimitedBlockWithLimitedResult", {
          lastPlayed: block.model.resultLastUpdated,
          onConfirmDispatch: {
            type: AT.SET_PAGE,
            pageState: page,
            confirmed: true
          },
          onNotConfirmDispatch: {
            type: AT.PLAY_BLOCK_REQUEST,
            blockID: block.model.blockID,
            discardLimitedResults: true
          }
        });
        return atPage(newState).set(function (p) {
          return OpsPage.leaveProblem(p);
        });
      }
    } else {
      return newState;
    }
  } else {
    return newState;
  }
};

//If a user just went to a chapter page from another page, check through the blocks in that
//chapter to make sure none have limited maxStars that have expired.
var checkForLimitedMaxStarsExpiring = function checkForLimitedMaxStarsExpiring(vault, oldState, newState, action) {
  var newPage = atPage(newState).get();
  //If the page was just switched to a chapter page, check all blocks for maxStars limits having expired.
  if (newPage && newPage.name === "trainer.chapter") {
    var chapter = atCurrChapter(newState).get();
    var blockIDs = chapter ? Derived.getAllChapterBlockIDs(newState, chapter.chapterID) : [];
    var nowMoment = moment(vault.clock.now());
    _.forEach(blockIDs, function (blockID) {
      var block = atBlock(newState, blockID).get();
      if (OpsBlock.haveLimitedMaxStarsExpired(block, nowMoment)) {
        newState = atBlock(newState, blockID).extendIn("model", {
          starsAvailable: 3,
          limitedStarsExpiration: false
        });
      }
    });
  }
  return newState;
};

//If the user just went to a page for a problem they now cannot play in a result that has been intervened,
// make the intervention slider appear.
var checkForInterventionSlider = function checkForInterventionSlider(vault, oldState, newState, action) {
  var newResult = atCurrResult(newState).get();
  if (newResult && newResult.hasIntervened && !newResult.hasSeenInterventionMessage) {
    var videoIntervention = false;
    var videoSetID = atCurrBlock(newState).getIn(["model", "videoSetID"]);
    var theaterSet = atTheaterSet(newState, videoSetID).get();
    var videoModels = _.get(theaterSet, "videoModels");
    if (videoModels && !_.some(videoModels, function (v) {
      return v.isWatched === true;
    })) {
      newState = atPage(newState).setIn("showVideo", true);
      newState = atPage(newState).setIn("videoIntervention", true);
      videoIntervention = true;
    }
    var newProblem = atCurrProblem(newState).get();
    if (!newProblem.outcome) {
      vault.emitEvent("resultIntervened", {
        videoIntervention: videoIntervention
      });
      newState = atCurrResult(newState).setIn("hasSeenInterventionMessage", true);
    }
  }
  return newState;
};
var checkForUserLoadOnBadChapter = function checkForUserLoadOnBadChapter(vault, oldState, newState, action) {
  // TODO: The need to check for TRAINER_INITIAL here is annoying, but needed
  // due to these two actions possibly happening in either order. How can we
  // make initialization more stable?
  if (action.type !== AT.LOAD_USER_SUCCESS && action.type !== AT.TRAINER_INITIAL) {
    return newState;
  }
  var page = atPage(newState).get();
  // If they go to classroom but don't have valid chapter page
  var user = atUser(newState).get();
  if (OpsPage.isInTrainer(page) && !OpsPage.isValidTrainerChapterPage(page) && !page.demo) {
    newState = atPage(newState).set(function (p) {
      return TrainerPage.fillChapterIndex(p, user);
    });
    vault.emitEvent("showGradeModal");
  }
  return newState;
};
var checkForUserLoadOnBadLabType = function checkForUserLoadOnBadLabType(vault, oldState, newState, action) {
  // TODO: The need to check for LAB_INITIAL here is annoying, but needed
  // due to these two actions possibly happening in either order. How can we
  // make initialization more stable?
  if (action.type !== AT.LOAD_USER_SUCCESS && action.type !== AT.TRAINER_INITIAL) {
    return newState;
  }
  var page = atPage(newState).get();
  // If they go to classroom but don't have valid chapter page
  var user = atUser(newState).get();
  if (OpsPage.isInLab(page) && page.name !== "lab.lobby" && !TrainerPage.isValidLabTypePage(page, user)) {
    newState = atPage(newState).set(function (p) {
      return TrainerPage.fillLabTypeIndex(p, user);
    });
    vault.emitEvent("showTypeModal");
  }
  return newState;
};
var checkForSpaceUnlockMessages = function checkForSpaceUnlockMessages(vault, oldState, newState) {
  var newPage = atPage(newState).get();
  var user = atUser(newState).get();
  var showTheaterUnlocked = _.get(user, ["model", "showJustUnlockedTheaterModal"]);
  var showLibraryUnlocked = _.get(user, ["model", "showJustUnlockedLibraryModal"]);
  // We only want to show the modal on the chapter page, but we want to do so
  // even if they leave and then come back to the chapter page
  if (newPage.name === "home.main") {
    if (showTheaterUnlocked) {
      vault.emitEvent("unlockedSpace", "theater");
      newState = atUser(newState).setIn(["model", "showJustUnlockedTheaterModal"], false);
    } else if (showLibraryUnlocked) {
      vault.emitEvent("unlockedSpace", "library");
      newState = atUser(newState).setIn(["model", "showJustUnlockedLibraryModal"], false);
    }
  }
  return newState;
};
var checkForUnlockMessages = function checkForUnlockMessages(vault, newState) {
  var newPage = atPage(newState).get();
  if (newPage.name === "trainer.chapter") {
    var unlockedBlock = _.find(atBlocks(newState).get(), function (b) {
      return _.get(b, "model.unlockedByTimesStartedOnBlockID", false);
    });
    if (unlockedBlock) {
      var _unlockedBlock$model = unlockedBlock.model,
        unlockedByTimesStartedOnBlockID = _unlockedBlock$model.unlockedByTimesStartedOnBlockID,
        blockID = _unlockedBlock$model.blockID;
      var blockName = atBlock(newState, unlockedByTimesStartedOnBlockID).getIn(["model", "displayName"]);
      vault.emitEvent("showChapterSlider", {
        type: "unlockByTimesCompleted",
        blockName: blockName
      });
      newState = atBlock(newState, blockID).setIn(["model", "unlockedByTimesStartedOnBlockID"], null);
    }
  }
  return newState;
};

//This contains the small checks that must occur on page changes
var checkTrainerPageChange = function checkTrainerPageChange(vault, oldState, newState, action) {
  var oldPage = atPage(oldState).get();
  var newPage = atPage(newState).get();
  var arePagesEqual = function arePagesEqual(page1, page2) {
    var p1 = _.defaults(oldPage, {
      isShowingNotification: false
    });
    var p2 = _.defaults(newPage, {
      isShowingNotification: false
    });
    return _.isEqual(p1, p2);
  };
  if (!_.isEqualWith(oldPage, newPage, arePagesEqual)) {
    vault.emitEvent("closeLevelUpModal");
    vault.emitEvent("closeNotificationModal");
    vault.emitEvent("closeSequenceSlideout");
    newState = atPage(newState).setIn("isShowingNotification", false);
  }
  if (!_.isEqual(oldPage, newPage) && newPage.name !== "trainer.history") {
    newState = checkForLimitedMaxStarsExpiring(vault, oldState, newState, action);
    newState = checkForInterventionSlider(vault, oldState, newState, action);
    var newResult = atCurrResult(newState).get();
    var oldResult = atCurrResult(oldState).get();
    var justLeftResult = oldResult && !OpsResult.isSameResult(oldResult, newResult);
    if (justLeftResult && atResultByPage(newState, oldPage).get()) {
      newState = atResultByPage(newState, oldPage).setIn("isFirst", false);
    }
  }
  newState = checkForSpaceUnlockMessages(vault, oldState, newState);
  newState = checkForUnlockMessages(vault, newState);
  return newState;
};
var checkForTestCooldownUnlocks = function checkForTestCooldownUnlocks(vault, oldState, newState, action) {
  var page = atPage(newState).get();
  if (page.name === "trainer.chapter" && _.isNumber(page.chapterIndex)) {
    var chapterID = GradeChapter.toChapterID(page.gradeNumber, page.chapterIndex);
    var chapter = chapterID && atChapter(newState, chapterID).get();
    var chapterModel = _.get(chapter, "model");
    var testBlockID = chapterModel && chapterModel.testBlockID;
    var testBlock = testBlockID && atBlock(newState, testBlockID).get();
    if (testBlock) {
      var nowMoment = moment(vault.clock.now());
      var blockModel = testBlock.model || {};
      if (blockModel.blockType === "test" && blockModel.progressLock === "locked" && blockModel.progressLockSource === "cooldown" && blockModel.testCooldownExpiration && nowMoment.isAfter(blockModel.testCooldownExpiration) && chapter.load === "done") {
        newState = atChapterByBlockID(newState, testBlockID).set(function (c) {
          return LoadState.loadRestart(c);
        });
        newState = atBlock(newState, testBlockID).set(function (b) {
          return LoadState.loadRestart(b);
        });
      }
    }
  }
  return newState;
};
var checkForLevelUnlocks = function checkForLevelUnlocks(vault, oldState, newState) {
  if (_.get(newState, "page.demo")) return newState;
  var oldXP = atUser(oldState).getIn(["model", "xp"]);
  var newXP = atUser(newState).getIn(["model", "xp"]);
  var oldLevel = TrainerCore.getLevel(oldXP);
  var newLevel = TrainerCore.getLevel(newXP);
  if (newLevel > oldLevel) {
    newState = doUnlockingAcrossLabTypes(newState, null, newLevel);
  }
  return newState;
};
var checkForReadAloudSeen = function checkForReadAloudSeen(vault, oldState, newState) {
  var newPage = atPage(newState).get();
  var currProblem = atCurrProblem(newState).get();
  if (!newPage.demo && OpsPage.shouldShowReadAloud(newPage) && OpsProblem.getReadAloudTextInfo(currProblem)) {
    newState = atCurrResult(newState).set(function (cr) {
      if (!cr || !cr.problems) return cr;
      var problemID = currProblem.problemID;
      if (!_.includes(cr.readAloudSeen, problemID)) cr = setIn(cr, "readAloudSeen", function (ras) {
        return ras.concat([problemID]);
      });
      return cr;
    });
  }
  return newState;
};

//
// Exported functions to augment vault updater
//

var augment = function augment(updater) {
  updater.addActionHandler(actionHandlers);
  updater.addPostUpdateHook(augmentSetPage, "trainer:augmentSetPage", -2000);
  updater.addPostUpdateHook(validateTrainerPage, "trainer:validateTrainerPage", -1000);
  updater.addPostUpdateHook(checkTrainerPageChange, "trainer:checkTrainerPageChange", -900);

  // This must occur before the TimeTracking hook (priority 0 atm)
  updater.addPostUpdateHook(OpsShared.checkForAutomatedInstructions, "trainer:checkForAutomatedInstructions", -500);
  updater.addPostUpdateHook(checkForTestCooldownUnlocks, "trainer:checkForTestCooldownUnlocks");
  updater.addPostUpdateHook(checkForLevelUnlocks, "trainer:checkForLevelUnlocks");
  updater.addPostUpdateHook(checkForReadAloudSeen, "trainer:checkForReadAloudSeen");
  updater.addPostUpdateHook(OpsShared.clearResultIfNecessary, "trainer:clearResultIfNecessary");
  updater.addPostUpdateHook(OpsShared.saveResultIfNeeded, "trainer:saveResultIfNeeded");
};
module.exports = {
  augment: augment
};

/***/ },

/***/ "./src/trainer/vault/addURLHooks.js"
/*!******************************************!*\
  !*** ./src/trainer/vault/addURLHooks.js ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var AT = __webpack_require__(/*! ../../core/vault/ActionTypes.js */ "./src/core/vault/ActionTypes.js");
var _require = __webpack_require__(/*! ../../core/vault/StateCursors.js */ "./src/core/vault/StateCursors.js"),
  atCurrResult = _require.atCurrResult;
var TrainerPage = __webpack_require__(/*! ./TrainerPage.js */ "./src/trainer/vault/TrainerPage.js");
var OpsResult = __webpack_require__(/*! ./OpsResult.js */ "./src/trainer/vault/OpsResult.js");
var OpsPage = __webpack_require__(/*! ../../core/vault/OpsPage.js */ "./src/core/vault/OpsPage.js");
var OpsUser = __webpack_require__(/*! ../../core/vault/OpsUser.js */ "./src/core/vault/OpsUser.js");
var URLMake = __webpack_require__(/*! ../../../shared/URLMake.js */ "./shared/URLMake.js");
var onNavigateProblemWhenDisconnected = function onNavigateProblemWhenDisconnected(vault, page, href) {
  var state = vault.getState();
  if (!state.connected && page.name === "trainer.problem") {
    vault.dispatch({
      type: AT.SHOW_MESSAGE,
      messageType: "disconnected"
    });
    return false;
  }
  return true;
};
var onLeaveResult = function onLeaveResult(vault, page, href, options) {
  // state.page is page state being left, page is new page state
  var state = vault.getState();
  if (!page || !state || !state.page) {
    return true;
  } else if (options.silent || options.confirmed) {
    return true;
  } else if (TrainerPage.wouldLeaveResult(state.page, page, state)) {
    var result = atCurrResult(state).get();
    if (OpsPage.isCurrentlyTakingTest(state.user, state.page) && OpsPage.isPageForTestBlock(state.page) && !OpsUser.hasKey(state.user, "trainer allow unfinished test")) {
      var messageType = result.resultType === "bookTest" ? "finishBookTest" : "finishTestOrQuit";
      vault.dispatch({
        type: AT.SHOW_CONFIRM,
        messageType: messageType,
        data: {
          onConfirmDispatch: {
            type: AT.SET_PAGE,
            pageState: URLMake.state.forOverview(result)
          },
          styleType: state.page.gradeNumber ? "grade" + state.page.gradeNumber : null
        }
      });
      return false;
    } else if (!state.user.sessionExpired && result && OpsResult.needsLeaveConfirm(result)) {
      vault.dispatch({
        type: AT.CONFIRM_PAGE_NAVIGATION,
        confirmType: "leaveResult",
        data: {
          canResume: OpsResult.canResumeResult(result),
          savesFailing: result.lastUpdateFailed,
          resultType: result.resultType
        },
        href: href
      });
      return false;
    }
  }
  return true;
};
module.exports = function (router) {
  router.addURLHook(onNavigateProblemWhenDisconnected);
  router.addURLHook(onLeaveResult);
};

/***/ }

}]);
//# sourceMappingURL=bundle_trainer.js.map