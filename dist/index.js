var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// ts/lib/dom/domElement.ts
var DomElement = class _DomElement {
  constructor(type, properties = {}) {
    this.type = type;
    var _a, _b;
    this.props = __spreadValues(__spreadValues({}, {
      style: {},
      attr: {}
    }), properties);
    this.domElement = document.createElement(type);
    this.domElement.setAttribute("draggable", "false");
    this.domElement.addEventListener("mousedown", this.click.bind(this));
    if (this.props.style)
      Object.entries((_a = this.props) == null ? void 0 : _a.style).forEach(([k, v]) => {
        this.setStyle(
          k,
          typeof v === "string" ? v : v[0],
          typeof v === "string" ? false : v[1]
        );
      });
    if (this.props.attr)
      Object.entries((_b = this.props) == null ? void 0 : _b.attr).forEach(([k, v]) => {
        this.domElement.setAttribute(k, v);
      });
    if (this.props.text)
      this.setText(this.props.text);
    if (this.props.className)
      this.domElement.className = this.props.className;
    if (this.props.id)
      this.domElement.id = this.props.id;
    if (this.props.onClick)
      this.onClick = this.props.onClick;
    if (this.props.visible !== void 0)
      this.visible = this.props.visible;
  }
  get onClick() {
    return this._onClick;
  }
  set onClick(func) {
    this._onClick = func;
  }
  set visible(b) {
    this.setStyle("display", b ? void 0 : "none", true);
  }
  setStyle(k, v, i = false) {
    if (v) {
      this.domElement.style.setProperty(k, v, i ? "important" : "");
      this.props.style[k] = [v, i];
    } else {
      this.domElement.style.removeProperty(k);
      delete this.props.style[k];
    }
  }
  setAttribute(k, v) {
    this.domElement.setAttribute(k, v);
    this.props.attr[k] = v;
  }
  setText(t) {
    this.domElement.innerText = t;
  }
  append(d) {
    this.domElement.appendChild(d.domElement);
    return d;
  }
  child(type, properties = {}) {
    return this.append(new _DomElement(type, properties));
  }
  click() {
    var _a;
    (_a = this.onClick) == null ? void 0 : _a.call(this);
  }
  remove(d) {
    try {
      this.domElement.removeChild(d.domElement);
    } catch (error) {
    }
  }
  clone() {
    return new _DomElement(this.type, __spreadValues({}, this.props));
  }
};

// ts/lib/dom/icon.ts
var Icon = class extends DomElement {
  constructor(properties) {
    super("span", {
      text: properties.name,
      className: "icon material-symbols-outlined ".concat(properties.classList || "")
    });
    this.fontVariation = {
      FILL: 0,
      wght: 230,
      GRAD: 30,
      opsz: 20
    };
    if (properties.weight)
      this.fontVariation.wght = properties.weight;
    if (properties.offset) {
      this.setStyle("transform", "translate(".concat(properties.offset.join("px,"), "px)"));
    }
    this.setVariation();
  }
  setVariation() {
    this.setStyle("font-variation-settings", Object.entries(this.fontVariation).map(([k, v]) => "'".concat(k, "' ").concat(v)).join(","));
  }
  static make(n, w, o) {
    return {
      name: n || "",
      weight: w || 200
    };
  }
};

// ts/lib/utilities/vector2.ts
function v2(x, y) {
  if (x === void 0)
    return new Vector2(0, 0);
  if (typeof x === "number")
    return new Vector2(x, y != null ? y : x);
  if (Array.isArray(x))
    return new Vector2(x[0], x[1]);
  if (x.x !== void 0 && x.y !== void 0)
    return new Vector2(x.x, x.y);
  return new Vector2(0, 0);
}
var Vector2 = class _Vector2 extends Array {
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  constructor(x, y) {
    super(x, y);
  }
  //Methods
  add(v) {
    return new _Vector2(this[0] + v[0], this[1] + v[1]);
  }
  subtract(v) {
    return new _Vector2(this[0] - v[0], this[1] - v[1]);
  }
  scale(n) {
    return new _Vector2(this[0] * n, this[1] * n);
  }
  c() {
    return new _Vector2(this[0], this[1]);
  }
};

// ts/lib/dom/button.ts
var Button = class extends DomElement {
  constructor(properties = {}) {
    var _a;
    super("button", __spreadValues(__spreadValues({}, properties), {
      text: void 0,
      className: " button ".concat((_a = properties.className) != null ? _a : "", " ").concat(properties.design || "default")
    }));
    this._enabled = true;
    this._active = false;
    if (properties.icon)
      this.append(new Icon(properties.icon));
    if (properties.text)
      this.span = this.child("span", {
        text: properties.text
      });
    if (properties.enabled)
      this.enabled = properties.enabled;
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(b) {
    this._enabled = b;
    this.domElement.classList[b ? "remove" : "add"]("disabled");
  }
  get active() {
    return this._active;
  }
  set active(b) {
    this._active = b;
    this.domElement.classList[b ? "add" : "remove"]("active");
  }
  setText(t) {
    this.span.setText(t);
  }
};

// ts/interface/menu.ts
var MenuP = class extends DomElement {
  constructor(button, d, prop = {}) {
    super("div", { className: "menu_panel " + (prop.classList || "") });
    this.button = button;
    this._open = false;
    this.columns = [];
    this.options = {};
    d.forEach((c) => {
      const column = this.child("div", { className: "menu_column" });
      const index = this.columns.push(column) - 1;
      c.forEach((a) => {
        this.addOption(a, index);
      });
    });
    this.open = false;
  }
  get open() {
    return this._open;
  }
  set open(value) {
    this._open = value;
    this.domElement.classList[value ? "add" : "remove"]("open");
    this.button.active = value;
  }
  toggle() {
    this.open = !this.open;
  }
  addOption(a, i) {
    const column = this.columns[i];
    if (typeof a === "string") {
      column.child("span", {
        className: "spacer",
        text: a
      });
      return;
    }
    this.removeOption(a.key);
    this.options[a.key] = {
      column,
      button: column.append(new Button({
        text: a.name || "...",
        onClick: () => {
          a.onClick();
          this.open = false;
        },
        icon: a.icon,
        design: a.design || "inline"
      })),
      hasIcon: Boolean(a.icon),
      label: a.name
    };
    if (a.icon)
      column.domElement.classList.add("icons");
  }
  removeOption(key) {
    const option = this.options[key];
    if (!option)
      return;
    option.column.remove(option.button);
    delete this.options[key];
  }
};
var MenuS = class extends MenuP {
  get open() {
    return super.open;
  }
  set open(value) {
    super.open = value;
    this.button.domElement.classList[value ? "add" : "remove"]("open");
  }
  constructor(button, c, d, prop = {}) {
    super(button, d.map((c2) => c2.map((v) => {
      if (typeof v === "string")
        return v;
      return {
        key: v.key,
        name: v.name,
        onClick: () => this.value(v.key),
        icon: v.icon
      };
    })), prop);
    this.domElement.classList.add("select");
    this.onChange = c;
  }
  value(key) {
    this.silentValue(key);
    this.onChange(key);
  }
  silentValue(key) {
    this.open = false;
    let foundText = "";
    Object.entries(this.options).forEach(([k, v]) => {
      v.button.active = k === key;
      if (k === key)
        foundText = v.label;
    });
    this.button.setText(foundText);
  }
};
var Menu = class extends DomElement {
  // private iterator: number = 0;
  constructor(d) {
    super("div", { className: "menu" });
    // panels: Record<string, MenuPanel> = {};
    this.buttons = {};
    if (d)
      d.forEach((v) => this.addButton(v));
  }
  addButton(data) {
    const menuWrap = this.child("div", { className: "menu_wrap menu_type_" + data.type.toLowerCase() });
    let button, panel;
    if (data.type === "Action") {
      button = menuWrap.append(new Button({
        onClick: data.onClick,
        icon: data.icon,
        text: data.name,
        design: data.design || "default"
      }));
    }
    if (data.type === "Select") {
      button = menuWrap.append(new Button({
        icon: data.icon,
        text: data.name,
        className: "opens",
        onClick: () => {
          panel.toggle();
        },
        design: data.design || "default"
      }));
      panel = menuWrap.append(new MenuS(button, data.onChange, data.data));
    }
    if (data.type === "Panel") {
      button = menuWrap.append(new Button({
        icon: data.icon,
        text: data.name,
        className: "opens",
        onClick: () => {
          panel.toggle();
        },
        design: data.design || "default"
      }));
      panel = menuWrap.append(new MenuP(button, data.data));
    }
    this.buttons[data.key] = {
      button,
      panel
    };
  }
  getButton(key) {
    return this.buttons[key];
  }
};

// ts/lib/utilities/utils.ts
var Util = class {
  static clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
  }
  static to0(value, tolerance = 0.1) {
    return Math.abs(value) < tolerance ? 0 : value;
  }
  static chunk(array, size) {
    const output = [];
    for (let i = 0; i < array.length; i += size) {
      output.push(array.slice(i, i + size));
    }
    return output;
  }
  static padArray(ar, b, len) {
    return ar.concat(Array.from(Array(len).fill(b))).slice(0, len);
  }
  static addArrays(ar, br) {
    return ar.map((a, i) => a + br[i]);
  }
  static subtractArrays(ar, br) {
    return ar.map((a, i) => a - br[i]);
  }
  static multiplyArrays(ar, br) {
    return ar.map((a, i) => a * br[i]);
  }
  static scaleArrays(ar, b) {
    return ar.map((a, i) => a * b);
  }
  static radToDeg(r) {
    return r * 180 / Math.PI;
  }
  static degToRad(d) {
    return d * Math.PI / 180;
  }
};

// ts/interface/panel.ts
var Panel = class extends DomElement {
  constructor(id, name) {
    super("div", {
      className: "panel",
      id
    });
    this.id = id;
    this.name = name;
    this.size = [0, 0];
    this.header = this.child("div", {
      className: "panelHeader"
    });
    this.content = this.child("div", {
      className: "panelContent"
    });
  }
  resize() {
    const { width, height } = this.content.domElement.getBoundingClientRect();
    this.size = [width, height];
  }
};

// ts/interface/section.ts
var Section = class _Section extends DomElement {
  static getEmpty() {
    return {
      type: "empty"
    };
  }
  static getPanel(n) {
    return {
      type: "panel",
      panel: $.panels.getPanel(n)
    };
  }
  static getSplit(c, d = "h", p = 50) {
    return {
      type: "split",
      direction: d,
      sections: c,
      percentage: p
    };
  }
  get dragging() {
    return this._dragging;
  }
  set dragging(value) {
    this._dragging = value;
    this.dragger.setStyle("pointerEvents", value ? "none" : "auto");
    this.dragger.domElement.classList[value ? "add" : "remove"]("dragging");
  }
  get direction() {
    return this._direction;
  }
  set direction(value) {
    this._direction = value;
    this.domElement.classList[this.direction === "h" ? "add" : "remove"]("h");
    this.domElement.classList[this.direction === "v" ? "add" : "remove"]("v");
  }
  get percentage() {
    return this._percentage;
  }
  set percentage(value) {
    this._percentage = Util.clamp(value, 5, 95);
    if (this.sections) {
      this.sections[0].setStyle(this.direction === "h" ? "width" : "height", "calc(".concat(this._percentage, "% - 3px)"));
      this.sections[1].setStyle(this.direction === "h" ? "width" : "height", "calc(".concat(100 - this._percentage, "% - 3px)"));
      this.sections[0].setStyle(this.direction === "h" ? "height" : "width", "100%");
      this.sections[1].setStyle(this.direction === "h" ? "height" : "width", "100%");
      this.dragger.setStyle("left", this.direction === "h" ? "calc(".concat(this._percentage, "% - 3px)") : "4px");
      this.dragger.setStyle("top", this.direction === "v" ? "calc(".concat(this._percentage, "% - 3px)") : "4px");
    }
    this.resize();
  }
  resize() {
    var _a;
    if (this.mode === "panel" && this.panel)
      this.panel.resize();
    if (this.mode === "split")
      (_a = this.sections) == null ? void 0 : _a.forEach((s) => s.resize());
  }
  get activePanel() {
    return this.panel;
  }
  setPanel(panel = "empty") {
    this.fill({
      type: "panel",
      panel: panel instanceof Panel ? panel : $.panels.getPanel(panel)
    });
    return this.panel;
  }
  setSplit(direction, percentage = 50, data) {
    this.fill({
      type: "split",
      sections: data ? data : [
        _Section.getEmpty(),
        _Section.getEmpty()
      ],
      percentage,
      direction
    });
    return this.sections;
  }
  removePanel() {
    if (this.panel) {
      this.contentWrap.remove(this.panel);
      this.panel = void 0;
    }
    this.panelSwitch.silentValue("empty");
  }
  empty(del = false) {
    var _a, _b;
    $.panels.unassign(this);
    this.removePanel();
    this.direction = void 0;
    (_a = this.sections) == null ? void 0 : _a.forEach((s) => s.empty(true));
    this.sections = void 0;
    this.percentage = void 0;
    if (del) {
      (_b = this.parent) == null ? void 0 : _b.contentWrap.remove(this);
    }
  }
  fill(content) {
    var _a;
    this.empty();
    if (content && content.type !== "empty") {
      this.mode = content.type;
      if (content.type === "panel") {
        this.domElement.classList.remove("s_split");
        this.domElement.classList.add("s_panel");
        this.panel = content.panel;
        $.panels.assign(this.panel, this);
        this.panelSwitch.silentValue((_a = this.panel) == null ? void 0 : _a.id);
        this.dragger.visible = false;
      } else {
        this.domElement.classList.remove("s_panel");
        this.domElement.classList.add("s_split");
        this.sections = content.sections.map((d) => new _Section(this, d));
        this.direction = content.direction || (this.parent.direction === "v" ? "h" : "v");
        this.percentage = content.percentage || 50;
        this.dragger.visible = true;
      }
    } else {
      this.setPanel();
    }
    this.resize();
  }
  constructor(parent, content) {
    super("div", {
      className: "section"
    });
    if (parent) {
      this.parent = parent;
      this.parent.contentWrap.append(this);
    }
    this.build();
    this.fill(content);
  }
  getData() {
    if (this.mode === "panel") {
      return {
        type: "panel",
        panel: this.panel
      };
    } else {
      return {
        type: "split",
        sections: this.sections.map((s) => s.getData()),
        percentage: this.percentage,
        direction: this.direction
      };
    }
  }
  build() {
    this.contentWrap = this.child("div", { className: "section_content" });
    this.child("div", {
      className: "section_outline"
    });
    this.dragger = this.child("span", {
      className: "section_dragger"
    });
    this.dragger.child("div", {
      className: "section_dragger_collapse"
    });
    this.domElement.addEventListener("mousemove", (e) => {
      if (this.dragging) {
        let v = this.direction === "v" ? (e.y - this.domElement.getBoundingClientRect().y) / this.domElement.offsetHeight * 100 : (e.x - this.domElement.getBoundingClientRect().x) / this.domElement.offsetWidth * 100;
        if (v !== 0)
          this.percentage = Util.clamp(v, 0, 100);
      }
    });
    this.dragger.domElement.addEventListener("mousedown", () => this.dragging = true);
    this.dragger.domElement.addEventListener("mouseup", () => this.dragging = false);
    this.domElement.addEventListener("mouseup", () => this.dragging = false);
    this.sectionMenu = this.append(new Menu([
      ...$.panels.getSelectObject(
        "panel",
        (v) => {
          this.setPanel(v);
        },
        this.parent ? () => {
          var _a;
          if (this.parent) {
            const other = this.parent.sections.find((s) => s !== this);
            const data = other.getData();
            if (data.type === "panel") {
              this.parent.setPanel(other.panel);
            } else {
              this.parent.setSplit(other.direction, other.percentage, (_a = other.getData()) == null ? void 0 : _a.sections);
            }
          }
        } : void 0,
        () => {
          this.setSplit("v", 50, [
            { type: "panel", panel: this.panel },
            _Section.getEmpty()
          ]);
        },
        () => {
          this.setSplit("h", 50, [
            { type: "panel", panel: this.panel },
            _Section.getEmpty()
          ]);
        }
      )
    ]));
    this.panelSwitch = this.sectionMenu.getButton("panel").panel;
  }
};

// ts/interface/interface.ts
var WorkSpace = class extends DomElement {
  constructor(presets) {
    super("div", {
      className: "content"
    });
    this.append($.windows);
    this.append($.drag);
    this.buildToolbar(presets);
    this.mainSection = this.append(new Section());
    this.setPreset(presets ? Object.keys(presets)[0] : "empty");
    window.addEventListener("resize", () => {
      this.resize();
    });
    this.resize();
  }
  resize() {
    $.windowSize = v2(window.innerWidth, window.innerHeight);
    $.windows.resize();
    this.mainSection.resize();
  }
  buildToolbar(presets) {
    const p = { empty: { name: "Empty", data: [0] } };
    if (presets)
      Object.assign(p, presets);
    this.header = this.child("header", {
      id: "toolbar"
    });
    this.header.append(new Menu([
      {
        key: "file",
        name: "File",
        type: "Panel",
        design: "inline",
        data: [[
          { key: "new", name: "New", icon: Icon.make("library_add"), onClick: () => {
          } },
          { key: "open", name: "Open...", icon: Icon.make("folder_open"), onClick: () => {
          } },
          { key: "recover", name: "Recover", icon: Icon.make("restore_page"), onClick: () => {
          } },
          "",
          { key: "save", name: "Save", icon: Icon.make("save"), onClick: () => {
          } },
          { key: "saveas", name: "Save As...", onClick: () => {
          } },
          { key: "import", name: "Import...", icon: Icon.make("file_open"), onClick: () => {
          } },
          { key: "export", name: "Export", icon: Icon.make("file_export"), onClick: () => {
          } },
          "",
          { key: "reset", name: "Reset", icon: Icon.make("reset_image"), onClick: () => {
          } }
        ]]
      },
      {
        key: "edit",
        name: "Edit",
        type: "Panel",
        design: "inline",
        data: [[
          { key: "undo", name: "Undo", icon: Icon.make("undo"), onClick: () => {
          } },
          { key: "redo", name: "Redo...", icon: Icon.make("redo"), onClick: () => {
          } },
          {
            key: "options",
            name: "Options...",
            icon: Icon.make("settings"),
            onClick: () => {
              $.windows.open("settings");
            }
          }
        ]]
      },
      {
        key: "workspace",
        name: "Workspace",
        design: "inline",
        icon: { name: "dashboard", weight: 200 },
        type: "Select",
        onChange: (k) => this.setPreset(k),
        data: [Object.entries(p).map(([k, v]) => {
          return { key: k, name: v.name };
        })]
      }
    ]));
    this.presets = Object.fromEntries(Object.entries(p).map(([k, v]) => {
      return [
        k,
        __spreadValues({}, v)
      ];
    }));
  }
  setPreset(n) {
    if (!this.presets[n])
      return;
    this.mainSection.fill(this.presetMap(this.presets[n].data));
  }
  presetMap(d) {
    if (!d)
      return Section.getEmpty();
    return [
      Section.getEmpty(),
      Section.getSplit(
        [this.presetMap(d[3]) || Section.getEmpty(), this.presetMap(d[4]) || Section.getEmpty()],
        d[1],
        d[2]
      ),
      Section.getPanel(
        d[1]
      )
    ][d[0]];
  }
};

// ts/interface/panelManager.ts
var PanelManager = class {
  constructor(panels) {
    this.list = {};
    panels == null ? void 0 : panels.forEach((p) => {
      this.list[p.id] = {
        id: p.id,
        panel: p,
        section: void 0
      };
    });
  }
  get(n) {
    return this.list[n];
  }
  getPanel(n) {
    var _a;
    return (_a = this.get(n)) == null ? void 0 : _a.panel;
  }
  unassign(n) {
    if (!n)
      return;
    let p, s;
    if (n instanceof Section) {
      s = n;
      p = n.activePanel;
      if (!p)
        return;
    } else {
      const d = this.get(typeof n === "string" ? n : n.name);
      if (!d || !d.panel || !d.section)
        return;
      s = d.section;
      p = d.panel;
    }
    s.removePanel();
    this.get(p.id).section = void 0;
  }
  assign(n, section) {
    if (!n)
      return;
    const d = this.get(typeof n === "string" ? n : n.id);
    if (!d)
      return;
    if (d.section)
      this.unassign(d.section);
    d.section = section;
    d.section.contentWrap.append(d.panel);
  }
  getSelectObject(key = "panel", switchPanel, close, splitH, splitV) {
    let buttons = [];
    let subMenu = [];
    if (switchPanel)
      buttons.push({
        key,
        name: "Panel",
        type: "Select",
        onChange: switchPanel,
        icon: Icon.make("grid_view"),
        data: [[{ key: "empty", name: "" }, ...Object.entries(this.list).map(([k, v]) => {
          return { key: k, name: v.panel.name };
        })]]
      });
    if (splitV)
      buttons.push({
        type: "Action",
        key: "splitV",
        icon: { name: "splitscreen_vertical_add", weight: 200 },
        design: "icon",
        onClick: splitV
      });
    if (splitH)
      buttons.push({
        type: "Action",
        key: "splitH",
        icon: { name: "splitscreen_add", weight: 200 },
        design: "icon",
        onClick: splitH
      });
    if (close)
      buttons.push({
        type: "Action",
        key: "close",
        icon: { name: "close", weight: 200 },
        design: "icon",
        onClick: close
      });
    return buttons;
  }
};

// ts/panels/utils/camera.ts
var Camera = class extends DomElement {
  constructor(parent, contentSize, clamp = true) {
    super("div", {
      className: "panelCamera draggable"
    });
    this.parent = parent;
    this.contentSize = contentSize;
    this.clamp = clamp;
    this._dragging = false;
    this.position = [0, 0];
    this.scale = 1;
    this.mover = this.child("div", {
      className: "panelCameraMover grid"
    });
    this.content = this.child("div", {
      className: "panelCameraContent",
      style: {
        width: "".concat(this.contentSize[0], "px"),
        height: "".concat(this.contentSize[1], "px")
      }
    });
    this.domElement.addEventListener("wheel", (e) => {
      this.scale = Util.clamp(this.scale + this.scale * (e.deltaY / 100) * -0.1, 0.1, 5);
      this.resize();
    });
    this.domElement.addEventListener("mouseleave", () => {
      this.dragging = false;
    });
    this.domElement.addEventListener("mousedown", () => {
      this.dragging = true;
    });
    this.domElement.addEventListener("mouseup", () => {
      this.dragging = false;
    });
    this.domElement.addEventListener("mousemove", this.mouseMove.bind(this));
  }
  get dragging() {
    return this._dragging;
  }
  set dragging(value) {
    this._dragging = value;
    this.domElement.classList[value ? "add" : "remove"]("grabbing");
  }
  mouseMove(e) {
    if (this.dragging) {
      this.move([e.movementX, e.movementY]);
    }
  }
  move(v) {
    this.setPosition(
      [
        this.position[0] + v[0],
        this.position[1] + v[1]
      ]
    );
  }
  resize() {
    [0, 1].forEach((i) => {
      this.mover.setStyle(["width", "height"][i], "".concat((this.parent.size[i] + 80 * this.scale) * (1 / this.scale), "px"));
    });
    this.setPosition(this.position);
  }
  setPosition(v) {
    [0, 1].forEach((i) => {
      this.position[i] = v[i];
    });
    this.mover.setStyle("transform", "translate(".concat(this.position.map((p) => {
      return p % (40 * this.scale) - 40 * this.scale;
    }).join("px,"), "px) scale(").concat(this.scale, ")"));
    this.content.setStyle("transform", "translate(".concat(this.position.map((p) => {
      return p;
    }).join("px,"), "px) scale(").concat(this.scale, ")"));
  }
};

// ts/panels/node/nodePanel.ts
var NodeEditorPanel = class extends Panel {
  constructor() {
    super("node", "Node");
    this.camera = this.content.append(new Camera(this, [500, 500]));
  }
  resize() {
    var _a;
    super.resize();
    (_a = this.camera) == null ? void 0 : _a.resize();
  }
};

// ts/panels/outliner.ts
var OutlinerPanel = class extends Panel {
  constructor() {
    super("outliner", "Outliner");
  }
};

// ts/panels/properties.ts
var PropertiesPanel = class extends Panel {
  constructor() {
    super("properties", "Properties");
  }
};

// ts/panels/timeline.ts
var TimelinePanel = class extends Panel {
  constructor() {
    super("timeline", "Timeline");
  }
};

// ts/panels/graphic/graphicPanel.ts
var GraphicPanel = class extends Panel {
  constructor() {
    super("graphic", "Graphic");
    this.camera = this.content.append(new Camera(this, [505, 545], false));
  }
  resize() {
    var _a;
    super.resize();
    (_a = this.camera) == null ? void 0 : _a.resize();
  }
};

// ts/interface/windows/windowManager.ts
var WindowManager = class extends DomElement {
  constructor(windows) {
    super("div", { className: "windows" });
    this.list = {};
    windows == null ? void 0 : windows.forEach((p, i) => {
      this.list[p.id] = {
        id: p.id,
        window: p
      };
      this.append(p);
      this.open(p.id);
    });
  }
  resize() {
    Object.values(this.list).forEach((w) => {
      w.window.resize();
    });
  }
  open(k) {
    this.list[k].window.open = true;
    this.list[k].window.order = -1;
    this.reorder();
  }
  close(k) {
    this.list[k].window.open = false;
  }
  closeAll() {
    Object.keys(this.list).forEach(this.close);
  }
  reorder() {
    Object.values(this.list).sort((a, b) => a.window.order - b.window.order).forEach((w, i, a) => {
      w.window.order = i * 2 + (i === a.length - 1 ? 1 : 0);
    });
  }
};

// ts/interface/windows/window.ts
var WindowPanel = class extends DomElement {
  constructor(id, name) {
    super("div", {
      className: "window",
      id
    });
    this.id = id;
    this.name = name;
    this._fullscreen = false;
    this.preFullscreen = [v2(), v2()];
    this.size = v2();
    this.position = v2(10, 10);
    this._open = false;
    this._order = 0;
    this.header = this.child("div", {
      className: "windowHeader"
    });
    this.header.append(new Icon({ name: "drag_indicator", classList: "drag" }));
    $.drag.register("window_".concat(id), {
      element: this.header.child("span", {
        text: name,
        className: "title"
      }),
      move: (e) => {
        this.setPosition(e.relative.add(e.offset));
      },
      start: () => {
        this.focus();
      }
    });
    this.header.append(new Menu([
      {
        key: "max",
        name: "",
        type: "Action",
        design: "inline",
        icon: Icon.make("filter_none"),
        onClick: () => {
          this.fullscreen = !this.fullscreen;
        }
      },
      {
        key: "close",
        name: "",
        type: "Action",
        design: "inline",
        icon: Icon.make("close"),
        onClick: () => {
          this.open = false;
        }
      }
    ]));
    this.content = this.child("div", {
      className: "windowContent"
    });
    this.domElement.addEventListener("click", () => {
      this.focus();
    });
  }
  get fullscreen() {
    return this._fullscreen;
  }
  set fullscreen(value) {
    if (this._fullscreen === value)
      return;
    this._fullscreen = value;
    this.domElement.classList[this.fullscreen ? "add" : "remove"]("fullscreen");
    if (this.fullscreen) {
      this.preFullscreen = [this.size.c(), this.position.c()];
      this.setSize();
      this.setPosition(v2());
    } else {
      this.setSize(this.preFullscreen[0]);
      this.setPosition(this.preFullscreen[1]);
    }
    $.drag.able("window_".concat(this.id), !this.fullscreen);
  }
  get open() {
    return this._open;
  }
  set open(value) {
    this._open = value;
    this.visible = value;
  }
  get order() {
    return this._order;
  }
  set order(value) {
    this._order = value;
    this.setStyle("z-index", String(value));
  }
  focus() {
    if (this.order % 2 === 0) {
      this.order = 100;
      $.windows.reorder();
    }
  }
  resize() {
    if (this.fullscreen) {
      this.setSize($.windowSize);
      this.setPosition(v2());
    }
    this.setSize();
    this.setPosition();
  }
  setSize(s = this.size) {
    this.size = s;
    [0, 1].forEach((i) => {
      if (this.fullscreen) {
        this.size[i] = $.windowSize[i];
      } else {
        this.size[i] = Util.clamp(this.size[i], 200, $.windowSize[i] - 20);
      }
      this.setStyle(["width", "height"][i], "".concat(this.size[i], "px"));
    });
  }
  setPosition(v = this.position) {
    this.position = v;
    this.setStyle("transform", "translate(".concat(this.position.map((p, i) => {
      return Util.clamp(p, 0, $.windowSize[i] - this.size[i]);
    }).join("px,"), "px)"));
  }
};

// ts/interface/windows/settings.ts
var Settings = class extends WindowPanel {
  constructor() {
    super("settings", "Settings");
  }
  resize() {
    super.resize();
  }
};

// ts/interface/dragManager.ts
var DragManager = class extends DomElement {
  constructor() {
    super("div", { className: "dragOverlay" });
    this._dragging = false;
    this.listeners = {};
    this.domElement.addEventListener("mousemove", (e) => {
      if (this.dragging)
        this.move(e);
    });
    this.domElement.addEventListener("mouseup", this.end.bind(this));
    this.domElement.addEventListener("mouseout", this.end.bind(this));
  }
  get dragging() {
    return this._dragging;
  }
  set dragging(value) {
    this._dragging = value;
    this.domElement.classList[value ? "add" : "remove"]("dragging");
  }
  register(key, reg) {
    this.listeners[key] = __spreadValues(__spreadValues({}, reg), { enabled: true });
    reg.element.domElement.addEventListener("mousedown", (e) => {
      if (this.listeners[key].enabled) {
        this.start(key, e);
      }
    });
    reg.element.domElement.classList.add("draggable");
  }
  able(key, b) {
    if (!this.listeners[key])
      return;
    this.listeners[key].enabled = b;
    this.listeners[key].element.domElement.classList[b ? "add" : "remove"]("draggable");
  }
  calcOffsets(key, e) {
    if (!this.listeners[key])
      return;
    let elementStart = v2(this.listeners[key].element.domElement.getBoundingClientRect());
    let mouseStart = v2(e.x, e.y);
    this.listeners[key].elementStart = elementStart;
    this.listeners[key].startOffset = elementStart.subtract(mouseStart);
  }
  start(key, e) {
    var _a, _b;
    if (!this.dragging) {
      this.current = this.listeners[key];
      this.dragging = true;
      this.calcOffsets(key, e);
      (_b = (_a = this.current).start) == null ? void 0 : _b.call(_a);
    }
  }
  move(e) {
    if (this.dragging && this.current.move) {
      const absolute = v2(e.clientX, e.clientY);
      let relative;
      if (this.current.reference) {
        relative = v2(e.movementX, e.movementY);
      } else {
        relative = absolute;
      }
      this.current.move({
        relative,
        absolute,
        offset: this.current.startOffset,
        delta: v2(e.movementX, e.movementY),
        total: absolute.add(this.current.startOffset).subtract(this.current.elementStart),
        e
      });
    }
  }
  end() {
    var _a, _b;
    if (this.dragging) {
      (_b = (_a = this.current).end) == null ? void 0 : _b.call(_a);
      this.current = void 0;
      this.dragging = false;
    }
  }
};

// ts/main.ts
var Main = class {
  constructor() {
    $.main = this;
    $.drag = new DragManager();
    $.panels = new PanelManager([
      new GraphicPanel(),
      new NodeEditorPanel(),
      new OutlinerPanel(),
      new PropertiesPanel(),
      new TimelinePanel()
    ]);
    $.windows = new WindowManager([
      new WindowPanel("s", "S"),
      new WindowPanel("a", "A"),
      new WindowPanel("b", "B"),
      new Settings()
    ]);
    $.workspace = new WorkSpace({
      default: {
        name: "Default",
        data: [1, "v", 80, [1, "h", 70, [2, "graphic"], [1, "v", 50, [2, "outliner"], [2, "properties"]]], [2, "timeline"]]
      }
    });
    $.workspace.resize();
    setTimeout(() => {
      $.workspace.resize();
    }, 20);
  }
  tick() {
  }
};

// ts/index.ts
var Glob = class {
};
window.$ = new Glob();
window.log = console.log;
document.addEventListener("DOMContentLoaded", async () => {
  const g = new Main();
  document.body.appendChild($.workspace.domElement);
});
//# sourceMappingURL=index.js.map
