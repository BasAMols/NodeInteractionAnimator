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
    if (this.props.onClick)
      this.onClick = this.props.onClick.bind(this);
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
    if (this.props.visible !== void 0)
      this.visible = this.props.visible;
  }
  class(b = void 0, ...d) {
    this.domElement.classList[b ? "add" : "remove"](...d);
  }
  get onClick() {
    return this._onClick;
  }
  set onClick(func) {
    if (this._onClick) {
      this.domElement.removeEventListener("mousedown", this._onClick.bind(this));
      this._onClick = void 0;
    }
    if (func) {
      this._onClick = func;
      this.domElement.addEventListener("mousedown", this._onClick.bind(this));
    }
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
  click(e) {
    var _a;
    (_a = this.onClick) == null ? void 0 : _a.call(this, e);
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
  clampComponents(min = 0, max = 1) {
    return new _Vector2(
      Util.clamp(this[0], min, max),
      Util.clamp(this[1], min, max)
    );
  }
  divideComponents(v) {
    if (v.every((n) => n !== 0)) {
      return new _Vector2(this[0] / v[0], this[1] / v[1]);
    }
    return new _Vector2(0, 0);
  }
  floor() {
    return new _Vector2(
      Math.floor(this.x),
      Math.floor(this.y)
    );
  }
  c() {
    return new _Vector2(this[0], this[1]);
  }
  magnitude() {
    return this.x * this.x + this.y * this.y;
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
    if (properties.hover)
      this.child("span", {
        className: "tooltip",
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
  toggle(b = !this.open) {
    this.open = b;
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
        text: a.name,
        onClick: () => {
          a.onClick();
          this.open = false;
        },
        icon: a.icon,
        design: a.design || "inline",
        className: a.className
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
    if (typeof data === "string") {
      this.child("div", { className: "menu_space", text: data });
    } else {
      const menuWrap = this.child("div", { className: "menu_wrap menu_type_".concat(data.type.toLowerCase(), " ").concat(data.className || "") });
      let button, panel;
      if (data.type === "Action") {
        button = menuWrap.append(new Button({
          onClick: data.onClick,
          icon: data.icon,
          text: data.name,
          design: data.design || "default",
          hover: data.hover
        }));
      }
      if (data.type === "Select") {
        button = menuWrap.append(new Button({
          icon: data.icon,
          text: data.name,
          className: "opens",
          hover: data.hover,
          onClick: () => {
            const b = panel.open;
            this.closeAll();
            panel.toggle(!b);
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
          hover: data.hover,
          onClick: () => {
            const b = panel.open;
            this.closeAll();
            panel.toggle(!b);
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
  }
  getButton(key) {
    return this.buttons[key];
  }
  closeAll() {
    Object.values(this.buttons).forEach((b) => {
      if (b.panel)
        b.panel.toggle(false);
    });
  }
};

// ts/interface/panel.ts
var Panel = class extends DomElement {
  constructor(id, name, attr = {}) {
    super("div", {
      className: "panel",
      id
    });
    this.id = id;
    this.name = name;
    this.size = v2(0);
    this.header = this.child("div", {
      className: "panelHeader"
    });
    this.content = this.child("div", {
      className: "panelContent"
    });
    this.menu = this.header.append(new Menu(attr.buttons));
  }
  resize() {
    const { width, height } = this.content.domElement.getBoundingClientRect();
    this.size = v2(width, height);
  }
  build() {
    this.resize();
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
  get direction() {
    return this._direction;
  }
  set direction(value) {
    this._direction = value;
    this.class(false, "v", "h");
    this.class(true, this.direction);
    $.mouse.able(this.resizerKey, true, value === "h" ? "col-resize" : "row-resize");
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
      this.resizer.setStyle("left", this.direction === "h" ? "calc(".concat(this._percentage, "% - 3px)") : "4px");
      this.resizer.setStyle("top", this.direction === "v" ? "calc(".concat(this._percentage, "% - 3px)") : "4px");
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
      this.class(true, "empty");
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
    this.class(true, "empty");
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
        this.class(false, "s_split");
        this.class(true, "s_panel");
        this.panel = content.panel;
        $.panels.assign(this.panel, this);
        this.panelSwitch.silentValue((_a = this.panel) == null ? void 0 : _a.id);
        this.class(!Boolean(this.panel), "empty");
        this.resizer.visible = false;
      } else {
        this.class(true, "s_split");
        this.class(false, "s_panel");
        this.sections = content.sections.map((d) => new _Section(this, d));
        this.direction = content.direction || (this.parent.direction === "v" ? "h" : "v");
        this.percentage = content.percentage || 50;
        this.resizer.visible = true;
      }
    } else {
      this.setPanel();
    }
    this.resize();
  }
  constructor(parent, content) {
    super("div", {
      className: "section empty"
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
    this.resizerKey = $.mouse.registerDrag($.unique, {
      element: this.resizer = this.child("span", {
        className: "section_dragger"
      }),
      reference: this,
      cursor: this.direction === "h" ? "col-resize" : "row-resize",
      move: (e) => {
        if (this.direction === "v") {
          this.percentage = e.factor.y * 100;
        }
        if (this.direction === "h") {
          this.percentage = e.factor.x * 100;
        }
      }
    });
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
    this.append($.mouse);
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
    const p = { empty: { name: "Empty", data: [0], icon: Icon.make("grid_off") } };
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
        icon: { name: "draft", weight: 200 },
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
            $.windows.open("import");
          } },
          { key: "export", name: "Export", icon: Icon.make("file_export"), onClick: () => {
            $.windows.open("export");
          } },
          "",
          { key: "reset", name: "Reset", icon: Icon.make("reset_image"), onClick: () => {
            if (window.confirm("This will refresh the page. Are you sure?"))
              window.location = window.location;
          } }
        ]]
      },
      {
        key: "edit",
        name: "Edit",
        type: "Panel",
        design: "inline",
        icon: { name: "edit_square", weight: 200 },
        data: [[
          { key: "undo", name: "Undo", icon: Icon.make("undo"), onClick: () => {
          } },
          { key: "redo", name: "Redo...", icon: Icon.make("redo"), onClick: () => {
          } },
          {
            key: "empty",
            name: "Empty scene",
            onClick: () => {
              $.scene.clear();
            }
          },
          "",
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
        name: "Layout",
        design: "inline",
        icon: { name: "dashboard", weight: 200 },
        type: "Panel",
        data: [Object.entries(p).map(([k, v]) => {
          return { key: k, icon: v.icon, name: v.name, onClick: () => {
            this.setPreset(k);
          } };
        })]
      },
      {
        key: "tools",
        name: "Tools",
        design: "inline",
        icon: { name: "construction", weight: 200 },
        type: "Panel",
        data: [[
          {
            key: "notes",
            name: "Notes",
            icon: Icon.make("notes"),
            onClick: () => {
              $.windows.open("notes");
            }
          }
        ]]
      },
      {
        key: "select",
        name: "Selected",
        design: "inline",
        className: "menuSelect",
        icon: { name: "ink_selection", weight: 200 },
        type: "Panel",
        data: [[
          {
            key: "des",
            name: "Deselect",
            icon: Icon.make("remove_selection"),
            onClick: () => {
              $.scene.focus();
            }
          },
          {
            key: "del",
            name: "Delete",
            icon: Icon.make("delete"),
            onClick: () => {
              $.scene.remove($.scene.selected);
            }
          }
        ]]
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
  forEach(f) {
    Object.entries(this.list).map(([k, d]) => [k, d.panel]).forEach(f);
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
    if (switchPanel) {
      let d = [[{ key: "empty", name: "", icon: Icon.make("more_horiz") }]];
      let lastMenu = 0;
      for (let i = 0; i < Object.entries(this.list).length; i++) {
        const [k, v] = Object.entries(this.list)[i];
        if (d[lastMenu].length > Math.ceil(Math.sqrt(Object.entries(this.list).length + 1)))
          lastMenu = d.push([]) - 1;
        d[lastMenu].push({ key: k, name: v.panel.name, icon: v.panel.icon });
      }
      buttons.push({
        key,
        name: "Panel",
        type: "Select",
        onChange: switchPanel,
        icon: Icon.make("grid_view"),
        data: d
      });
      buttons.push("|");
    }
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
  constructor(parent, attr) {
    var _a, _b;
    super("div", {
      className: "panelCamera"
    });
    this.parent = parent;
    this.position = v2();
    this.scale = 1;
    this.attr = {
      scrollSpeed: 1,
      minZoom: 1,
      maxZoom: 1
    };
    Object.assign(this.attr, attr);
    this.grid = this.child("div", {
      className: "panelCameraMover grid"
    });
    this.content = this.child("div", {
      className: "panelCameraContent",
      style: {
        width: "".concat((_a = this.attr.contentSize) == null ? void 0 : _a[0], "px"),
        height: "".concat((_b = this.attr.contentSize) == null ? void 0 : _b[1], "px")
      }
    });
    this.draggerKey = $.mouse.registerDrag($.unique, {
      element: this,
      cursor: "grab",
      move: (e) => {
        this.move(e.delta);
      }
    });
    this.scrollKey = $.mouse.registerScroll($.unique, {
      element: this,
      reference: this.content,
      scroll: (e) => {
        const newScale = Util.clamp(this.scale + this.scale * (e.delta / 100) * (-0.1 * this.attr.scrollSpeed), this.attr.minZoom, this.attr.maxZoom);
        this.move(e.relative.scale(1 - newScale / this.scale));
        this.scale = newScale;
        this.resize();
      }
    });
  }
  move(v) {
    this.setPosition(v2(this.position[0] + v[0], this.position[1] + v[1]));
  }
  resize() {
    [0, 1].forEach((i) => {
      this.grid.setStyle(["width", "height"][i], "".concat((this.parent.size[i] + 100 * this.scale) * (1 / this.scale), "px"));
    });
    this.setPosition(this.position);
  }
  setPosition(v) {
    this.position = v;
    this.grid.setStyle("transform", "translate(".concat(this.position.map((p) => {
      return p % (50 * this.scale) - 50 * this.scale;
    }).join("px,"), "px) scale(").concat(this.scale, ")"));
    this.content.setStyle("transform", "translate(".concat(this.position.map((p) => {
      return p;
    }).join("px,"), "px) scale(").concat(this.scale, ")"));
  }
  center() {
    if (this.attr.contentSize) {
      this.setPosition(this.parent.size.subtract(this.attr.contentSize.scale(this.scale)).scale(0.5));
    } else {
      this.setPosition(v2(0, 0));
    }
  }
};

// ts/panels/cameraPanel.ts
var CameraPanel = class extends Panel {
  constructor(id, name, attr = {}) {
    super(id, name, __spreadValues(__spreadValues({}, attr), { buttons: [{
      className: "panelMenu",
      key: "graphic_center",
      type: "Action",
      design: "icon",
      icon: Icon.make("recenter"),
      onClick: () => {
        this.camera.center();
      }
    }, ...attr.buttons || []] }));
    this.camera = this.content.append(new Camera(this, attr.camera || {}));
  }
  childCamera(type, properties) {
    return this.appendCamera(new DomElement(type, properties));
  }
  appendCamera(d) {
    return this.camera.content.append(d);
  }
  resize() {
    var _a;
    super.resize();
    (_a = this.camera) == null ? void 0 : _a.resize();
  }
  build() {
    this.camera.center();
  }
};

// ts/panels/node/nodePanel.ts
var NodeEditorPanel = class extends CameraPanel {
  constructor() {
    super("node", "Node", {
      camera: { contentSize: v2(505, 545), minZoom: 0.1, maxZoom: 5, scrollSpeed: 2 }
    });
    this.icon = Icon.make("linked_services");
  }
};

// ts/panels/outliner.ts
var OutlinerPanel = class extends Panel {
  constructor() {
    super("outliner", "Outliner");
    this.icon = Icon.make("summarize");
  }
  empty() {
    this.content.domElement.innerHTML = "";
  }
  addLine(o) {
    this.content.append(o.components.outline.element);
  }
  update(data) {
    this.empty();
    data.forEach((s) => {
      this.addLine(s);
    });
  }
};

// ts/panels/properties/propertiesPanel.ts
var PropertiesPanel = class extends Panel {
  constructor() {
    super("properties", "Properties");
    this.icon = Icon.make("tune");
  }
  update(p) {
    if (this.active) {
      this.content.remove(this.active.element);
      this.active = void 0;
    }
    if (p) {
      this.content.append(p.element);
      this.active = p;
    }
  }
};

// ts/panels/timeline.ts
var TimelinePanel = class extends Panel {
  constructor() {
    super("timeline", "Timeline");
    this.icon = Icon.make("timeline");
    this.menu.addButton({
      key: $.unique,
      type: "Action",
      design: "icon",
      icon: Icon.make("skip_previous"),
      onClick: () => {
      }
    });
    this.menu.addButton({
      key: $.unique,
      type: "Action",
      design: "icon",
      icon: Icon.make("resume"),
      onClick: () => {
      }
    });
    this.menu.addButton({
      key: $.unique,
      type: "Action",
      design: "icon",
      icon: Icon.make("skip_next"),
      onClick: () => {
      }
    });
    this.menu.addButton({
      key: $.unique,
      type: "Action",
      design: "icon",
      icon: Icon.make("autoplay"),
      onClick: () => {
      }
    });
  }
};

// ts/panels/graphic/graphicPanel.ts
var GraphicPanel = class extends CameraPanel {
  constructor() {
    super("graphic", "Graphic", {
      camera: { contentSize: v2(505, 545), minZoom: 0.1, maxZoom: 5, scrollSpeed: 2 },
      buttons: [
        {
          key: "graphic_light",
          type: "Action",
          design: "icon",
          icon: Icon.make("light_mode"),
          onClick: () => {
            this.light = !this.light;
          }
        },
        {
          key: "graphic_preview",
          type: "Action",
          design: "icon",
          icon: Icon.make("view_in_ar"),
          onClick: () => {
            this.preview = !this.preview;
          }
        }
      ]
    });
    this.icon = Icon.make("animation");
    this._light = false;
    this._preview = false;
    this.components = [];
    this.graphic = this.childCamera("div", {
      className: "_graphic"
    });
  }
  get light() {
    return this._light;
  }
  set light(value) {
    this._light = value;
    this.class(value, "light");
    this.menu.getButton("graphic_light").button.active = value;
  }
  get preview() {
    return this._preview;
  }
  set preview(value) {
    this._preview = value;
    this.class(value, "preview");
    this.menu.getButton("graphic_preview").button.active = value;
  }
  clear() {
    this.components.forEach((v) => {
      v.delete();
      this.components.splice(this.components.indexOf(v), 1);
    });
  }
  update(d) {
    const rem = [...this.components];
    const add = [];
    d.forEach((v) => {
      if (this.components.includes(v)) {
        v.update();
        rem.splice(rem.indexOf(v), 1);
      } else {
        add.push(v);
      }
    });
    if (rem.length > 0) {
      rem.forEach((v) => {
        v.delete();
        this.components.splice(this.components.indexOf(v), 1);
      });
    }
    if (add.length > 0) {
      add.forEach((v) => {
        v.add(this.graphic);
        this.components.push(v);
      });
    }
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
      this.close(p.id);
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
    $.mouse.registerDrag("window_".concat(id), {
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
    this.resizerKey = $.mouse.registerDrag($.unique, {
      element: this.resizer = this.child("span", {
        className: "resizer"
      }),
      reference: this,
      cursor: "nw-resize",
      move: (e) => {
        this.setSize(e.relative);
      },
      start: () => {
        this.focus();
      }
    });
    this.resizer.append(new Icon({ name: "aspect_ratio", weight: 200 }));
    this.header.append(new Menu([
      {
        key: "max",
        name: "",
        className: "max-button",
        type: "Action",
        design: "inline",
        icon: Icon.make("check_box_outline_blank"),
        onClick: () => {
          this.fullscreen = true;
        }
      },
      {
        key: "min",
        name: "",
        className: "min-button",
        type: "Action",
        design: "inline",
        icon: Icon.make("filter_none"),
        onClick: () => {
          this.fullscreen = false;
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
    $.mouse.able("window_".concat(this.id), !this.fullscreen);
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
var SettingsPanel = class extends WindowPanel {
  constructor() {
    super("settings", "Settings");
  }
  resize() {
    super.resize();
  }
};

// ts/interface/dragging/dragManager.ts
var DragManager = class extends DomElement {
  constructor() {
    super("div", { className: "dragOverlay" });
    this._dragging = false;
    this.dragListeners = {};
    this.scrollListeners = {};
    this.domElement.addEventListener("mousemove", (e) => {
      if (this.dragging)
        this.move(e);
    });
    this.domElement.addEventListener("mouseup", this.end.bind(this));
  }
  get dragging() {
    return this._dragging;
  }
  set dragging(value) {
    this._dragging = value;
    this.domElement.classList[value ? "add" : "remove"]("dragging");
    $.state[value ? "set" : "unset"]("dragging");
  }
  registerDrag(key, reg) {
    var _a;
    this.dragListeners[key] = __spreadValues(__spreadValues({}, reg), { enabled: true, brokeTolerance: false });
    reg.element.domElement.addEventListener("mousedown", (e) => {
      if (this.dragListeners[key].enabled) {
        this.start(key, e);
      }
    });
    reg.element.class(true, "cursor_".concat((_a = reg.cursor) != null ? _a : "grab"), "draggable");
    return key;
  }
  registerScroll(key, reg) {
    this.scrollListeners[key] = __spreadValues(__spreadValues({}, reg), { enabled: true });
    reg.element.domElement.addEventListener("wheel", (e) => {
      if (this.scrollListeners[key].enabled) {
        this.scroll(key, e);
      }
    });
    reg.element.class(true, "scrollable");
    return key;
  }
  able(key, b, c) {
    var _a, _b;
    if (this.dragListeners[key]) {
      this.dragListeners[key].enabled = b;
      this.dragListeners[key].element.domElement.classList[b ? "add" : "remove"]("draggable");
      if (c) {
        this.dragListeners[key].element.class(false, "cursor_".concat((_a = this.dragListeners[key].cursor) != null ? _a : "grab"));
        this.dragListeners[key].cursor = c;
        this.dragListeners[key].element.class(true, "cursor_".concat((_b = this.dragListeners[key].cursor) != null ? _b : "grab"));
      }
    }
    if (this.scrollListeners[key]) {
      this.scrollListeners[key].enabled = b;
      this.scrollListeners[key].element.domElement.classList[b ? "add" : "remove"]("scrollable");
    }
  }
  cursor(key, c) {
    var _a, _b;
    if (!key || !this.dragListeners[key])
      return;
    this.dragListeners[key].element.class(false, "cursor_".concat((_a = this.dragListeners[key].cursor) != null ? _a : "grab"));
    this.dragListeners[key].cursor = c;
    this.dragListeners[key].element.class(true, "cursor_".concat((_b = this.dragListeners[key].cursor) != null ? _b : "grab"));
  }
  calcOffsets(key, e) {
    if (!this.dragListeners[key])
      return;
    let elementStart = v2(this.dragListeners[key].element.domElement.getBoundingClientRect());
    let mouseStart = v2(e.x, e.y);
    this.dragListeners[key].elementStart = elementStart;
    this.dragListeners[key].startOffset = elementStart.subtract(mouseStart);
  }
  start(key, e) {
    var _a, _b;
    if (!this.dragging) {
      this.current = this.dragListeners[key];
      this.dragging = true;
      this.calcOffsets(key, e);
      (_b = (_a = this.current).start) == null ? void 0 : _b.call(_a);
      this.current.brokeTolerance = !this.current.initialTolerance;
    }
  }
  move(e) {
    if (this.dragging && this.current.move) {
      const absolute = v2(e.clientX, e.clientY);
      if (!this.current.brokeTolerance) {
        if (this.current.elementStart.subtract(this.current.startOffset).subtract(absolute).magnitude() > this.current.initialTolerance) {
          this.current.brokeTolerance = true;
        } else {
          return;
        }
      }
      let relative, factor = v2();
      if (this.current.reference) {
        const ref = this.current.reference.domElement.getBoundingClientRect();
        relative = absolute.subtract(v2(ref));
        factor = relative.divideComponents(v2(ref.width, ref.height));
      } else {
        relative = absolute;
      }
      this.current.move({
        relative,
        absolute,
        offset: this.current.startOffset,
        delta: v2(e.movementX, e.movementY),
        total: absolute.add(this.current.startOffset).subtract(this.current.elementStart),
        factor,
        e
      });
    }
  }
  scroll(key, e) {
    if (key && this.scrollListeners[key] && this.scrollListeners[key].enabled) {
      const target = this.scrollListeners[key];
      const absolute = v2(e.clientX, e.clientY);
      let relative, factor = v2();
      if (target.reference) {
        const ref = target.reference.domElement.getBoundingClientRect();
        relative = absolute.subtract(v2(ref));
        factor = relative.divideComponents(v2(ref.width, ref.height));
      } else {
        relative = absolute;
      }
      target.scroll({
        relative,
        absolute,
        delta: e.deltaY,
        factor,
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

// ts/interface/windows/notes.ts
var NotesPanel = class extends WindowPanel {
  constructor() {
    super("notes", "Notes");
    this.area = this.content.child("textarea");
    this.area.domElement.addEventListener("change", (v) => {
      this.text = this.area.domElement.textContent;
    });
  }
  resize() {
    super.resize();
  }
};

// ts/interface/windows/import.ts
var ImportPanel = class extends WindowPanel {
  constructor() {
    super("import", "Import");
  }
  resize() {
    super.resize();
  }
};

// ts/interface/windows/export.ts
var ExportPanel = class extends WindowPanel {
  constructor() {
    super("export", "Export");
  }
  resize() {
    super.resize();
  }
};

// ts/sceneobjects/components/sceneobjectComponent.ts
var SceneObjectComponent = class {
  constructor(type) {
    this._selected = false;
    this.type = type;
    this.key = $.unique;
  }
  get selected() {
    return this._selected;
  }
  set selected(value) {
    if (this._selected !== value) {
      this._selected = value;
      this.updateState();
    }
  }
  updateState() {
  }
  build() {
  }
  resize() {
  }
  delete() {
  }
};

// ts/sceneobjects/components/sceneobjectComponentNode.ts
var SceneObjectComponentNode = class extends SceneObjectComponent {
  constructor() {
    super("node");
  }
};

// ts/lib/dom/domInput.ts
var DomInput = class extends DomElement {
  constructor(type, properties = {}) {
    super(type, properties);
    this.type = type;
    if (this.props.onChange)
      this.onChange = this.props.onChange.bind(this);
    if (this.props.onKeyUp)
      this.onKeyUp = this.props.onKeyUp.bind(this);
    if (this.props.value)
      this.value = this.props.value;
  }
  get value() {
    return this.domElement.value;
  }
  set value(value) {
    this.domElement.value = value;
  }
  get onChange() {
    return this._onChange;
  }
  set onChange(func) {
    if (this._onChange) {
      this.domElement.removeEventListener("change", this._onChange.bind(this));
      this._onChange = void 0;
    }
    if (func) {
      this._onChange = func;
      this.domElement.addEventListener("change", this._onChange.bind(this));
    }
  }
  get onKeyUp() {
    return this._onKeyUp;
  }
  set onKeyUp(func) {
    if (this._onKeyUp) {
      this.domElement.removeEventListener("keyup", this._onKeyUp.bind(this));
      this._onKeyUp = void 0;
    }
    if (func) {
      this._onKeyUp = func;
      this.domElement.addEventListener("keyup", this._onKeyUp.bind(this));
    }
  }
};

// ts/panels/properties/propsInput.ts
var PropsInput = class extends DomElement {
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
    this.onChange(this._value);
  }
  constructor({ onChange, classList = "" }) {
    super("div", { className: "props_input ".concat(classList) });
    this.onChange = onChange;
  }
  silent(v) {
    this._value = v;
  }
};

// ts/panels/properties/propsInputString.ts
var PropsInputString = class extends PropsInput {
  constructor(onChange, def) {
    super({
      onChange,
      classList: "string"
    });
    this.input = this.append(new DomInput("input", {
      attr: {
        "type": "string"
      },
      onKeyUp: () => this.value = this.input.domElement.value,
      onChange: () => this.value = this.input.domElement.value,
      value: def ? def : ""
    }));
  }
  silent(v) {
    super.silent(v);
    this.input.value = String(v);
  }
};

// ts/sceneobjects/components/sceneobjectComponentOutline.ts
var SceneObjectComponentOutline = class extends SceneObjectComponent {
  constructor() {
    super("outline");
    this._toggle = false;
  }
  get toggle() {
    return this._toggle;
  }
  set toggle(value) {
    this._toggle = value;
    this.element.class(value, "open");
  }
  set name(v) {
    this.nameElement.setText(v);
  }
  updateState() {
    super.updateState();
    this.element.class(this.selected, "selected");
  }
  build() {
    this.element = new DomElement("div", { className: "sceneline" });
    const head = this.element.child("div", { className: "sceneline_head" });
    head.append(new Button({
      className: "sceneline_head_collapse",
      icon: Icon.make("keyboard_arrow_down"),
      design: "icon",
      onClick: () => {
        this.toggle = !this.toggle;
      }
    }));
    this.nameElement = head.child("div", { className: "sceneline_head_content", text: this.sceneObject.name || this.sceneObject.key });
    const meta = head.child("div", { className: "sceneline_head_meta" });
    meta.append(new Button({
      className: "sceneline_select",
      icon: Icon.make("arrow_selector_tool"),
      design: "icon",
      onClick: () => {
        this.sceneObject.focus();
      }
    }));
    meta.append(new Button({ icon: Icon.make("delete_forever"), design: "icon", onClick: () => {
      $.scene.remove(this.sceneObject);
    } }));
    const content = this.element.child("div", { className: "sceneline_content" });
    let count = 0;
    Object.values(this.sceneObject.components).forEach((c) => {
      if (c.type !== "outline") {
        count++;
        this.addLineChild(content, c);
      }
    });
    content.setStyle("max-height", "".concat(count * 30, "px"));
    this.sceneObject.defineProperty("name", {
      input: new PropsInputString((v) => {
        this.sceneObject.name = v;
      }, this.sceneObject.name),
      name: "Name"
    });
  }
  addLineChild(parent, o) {
    const line = parent.child("div", { className: "sceneline" });
    const head = line.child("div", { className: "sceneline_head" });
    head.child("div", { className: "sceneline_head_content", text: o.type });
    const meta = head.child("div", { className: "sceneline_head_meta" });
    meta.append(new Button({
      className: "sceneline_select",
      icon: Icon.make("arrow_selector_tool"),
      design: "icon",
      onClick: () => {
        this.sceneObject.focus();
      }
    }));
  }
  delete() {
    super.delete();
    if (this.element.domElement.parentElement)
      this.element.domElement.parentElement.removeChild(this.element.domElement);
  }
};

// ts/sceneobjects/components/sceneobjectComponentProperties.ts
var SceneObjectComponentProperties = class extends SceneObjectComponent {
  constructor() {
    super("properties");
    this.data = {};
    this.element = new DomElement("div", {
      className: "props"
    });
  }
  add(key, data) {
    if (this.data[key])
      return;
    const el = new DomElement("div", { className: "prop" });
    this.element.append(el);
    if (data.name)
      el.child("label", {
        text: data.name,
        className: "props_label"
      });
    el.append(data.input);
    this.data[key] = __spreadValues(__spreadValues({}, data), {
      element: el
    });
    return data.input;
  }
  remove(key) {
    if (this.data[key]) {
      this.element.remove(this.data[key].element);
      delete this.data[key];
    }
  }
  update(key, obj) {
    Object.assign(this.data[key], obj);
    this.updateValue(key);
  }
  delete() {
    super.delete();
    Object.keys(this.data).forEach((d) => {
      this.remove(d);
    });
  }
  updateValue(key) {
  }
};

// ts/panels/properties/propsInputBoolean.ts
var PropsInputBoolean = class extends PropsInput {
  constructor(onChange, def) {
    super({
      onChange,
      classList: "vector"
    });
    this._value = false;
    this.trueButton = this.child("div", {
      onClick: () => {
        this.value = true;
        this.falseButton.visible = true;
        this.trueButton.visible = false;
      }
    });
    this.trueButton.append(new Icon({ name: "check_box_outline_blank" }));
    this.falseButton = this.child("div", {
      onClick: () => {
        this.value = false;
        this.falseButton.visible = false;
        this.trueButton.visible = true;
      }
    });
    this.falseButton.append(new Icon({ name: "check_box" }));
    this.silent(def || false);
  }
  silent(v) {
    super.silent(v);
    this.falseButton.visible = v;
    this.trueButton.visible = !v;
  }
};

// ts/lib/dom/domSelect.ts
var DomSelect = class extends DomInput {
  get value() {
    return super.value;
    ;
  }
  set value(value) {
    super.value = value;
  }
  constructor(properties = {}) {
    super("select", properties);
    if (properties.options)
      properties.options.forEach(([value, text]) => {
        this.child("option", {
          text,
          attr: {
            "value": value
          }
        });
      });
  }
};

// ts/panels/properties/propsInputSelect.ts
var PropsInputSelect = class extends PropsInput {
  constructor(onChange, options, def) {
    super({
      onChange,
      classList: "vector"
    });
    this.input = this.append(new DomSelect({
      attr: {
        "type": "number"
      },
      onKeyUp: () => this.value = this.input.domElement.value,
      onChange: () => this.value = this.input.domElement.value,
      value: def ? String(def[0]) : "",
      options
    }));
  }
  silent(v) {
    this.input.value = this.value;
  }
};

// ts/panels/properties/propsInputVector.ts
var PropsInputVector = class extends PropsInput {
  constructor(onChange, def) {
    super({
      onChange,
      classList: "vector"
    });
    this._value = v2(0, 0);
    this.input1 = this.append(new DomInput("input", {
      attr: {
        "type": "number"
      },
      onKeyUp: () => {
        this.value = v2(
          Number(this.input1.domElement.value),
          this.value[1]
        );
      },
      onChange: () => {
        this.value = v2(
          Number(this.input1.domElement.value),
          this.value[1]
        );
      },
      value: def ? String(def[0]) : "0"
    }));
    this.input2 = this.append(new DomInput("input", {
      attr: {
        "type": "number"
      },
      onChange: () => this.value = v2(
        this.value[0],
        Number(this.input2.domElement.value)
      ),
      onKeyUp: () => this.value = v2(
        this.value[0],
        Number(this.input2.domElement.value)
      ),
      value: def ? String(def[1]) : "0"
    }));
  }
  silent(v) {
    super.silent(v.c());
    this.input1.value = String(this.value[0]);
    this.input2.value = String(this.value[1]);
  }
};

// ts/sceneobjects/components/sceneobjectComponentVisual.ts
var Visual = class extends DomElement {
  constructor(type, sceneObject) {
    super("div", {
      className: "visual visual_".concat(type)
    });
    this.sceneObject = sceneObject;
  }
  set(data) {
    Object.assign(this.data, data);
  }
};
var VisualTypeDictionary = {
  image: class VImage extends Visual {
    constructor(data = {}, sceneObject) {
      super("image", sceneObject);
      this.data = {
        position: v2(),
        size: v2(),
        url: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Test.svg",
        repeat: false,
        backgroundSize: "contain",
        backgroundSizeCustom: v2(),
        backgroundPosition: "center",
        backgroundPositionCustom: v2()
      };
      this.sizeInput = this.sceneObject.defineProperty($.unique, {
        input: new PropsInputVector((v) => {
          this.set({
            size: v.c()
          });
        }),
        name: "Size"
      });
      this.repeat = this.sceneObject.defineProperty($.unique, {
        input: new PropsInputBoolean((v) => {
          this.set({
            repeat: v
          });
        }),
        name: "Repeat"
      });
      this.url = this.sceneObject.defineProperty($.unique, {
        input: new PropsInputString((v) => {
          this.set({
            url: v
          });
        }),
        name: "URL"
      });
      this.backgroundSize = this.sceneObject.defineProperty($.unique, {
        input: new PropsInputSelect((v) => {
          this.set({
            backgroundSize: v
          });
        }, [["auto", "Auto"], ["contain", "Contain"], ["cover", "Cover"], ["stretch", "Stretch"], ["custom", "Custom"]], "auto"),
        name: "Background-size"
      });
      this.backgroundSizeCustom = this.sceneObject.defineProperty($.unique, {
        input: new PropsInputVector((v) => {
          console.log(v);
          this.set({
            backgroundSizeCustom: v.c()
          });
        })
      });
      this.backgroundPosition = this.sceneObject.defineProperty($.unique, {
        input: new PropsInputSelect((v) => {
          this.set({
            backgroundPosition: v
          });
        }, [["left", "Left"], ["top", "Top"], ["right", "Right"], ["bottom", "Bottom"], ["center", "Center"], ["custom", "Custom"]], "auto"),
        name: "Background-position"
      });
      this.backgroundPositionCustom = this.sceneObject.defineProperty($.unique, {
        input: new PropsInputVector((v) => {
          this.set({
            backgroundPositionCustom: v.c()
          });
        })
      });
      this.set(data);
    }
    set(data) {
      var _a, _b;
      super.set(data);
      this.setStyle("width", "".concat(this.data.size.x, "px"));
      this.setStyle("height", "".concat(this.data.size.y, "px"));
      this.setStyle("background-repeat", this.data.repeat ? "repeat" : "no-repeat");
      if (this.data.url) {
        this.class(false, "empty");
        this.setStyle("background-image", "url(".concat(this.data.url, ")"));
        switch (this.data.backgroundSize) {
          case "stretch":
            this.setStyle("background-size", "100% 100%");
            break;
          case "custom":
            this.setStyle("background-size", this.data.backgroundSizeCustom.join("px ") + "px");
            break;
          default:
            this.setStyle("background-size", this.data.backgroundSize);
            break;
        }
        switch (this.data.backgroundPosition) {
          case "custom":
            this.setStyle("background-position", this.data.backgroundPositionCustom.join("px ") + "px");
            break;
          default:
            this.setStyle("background-position", this.data.backgroundPosition);
            break;
        }
      } else {
        this.class(true, "empty");
        this.setStyle("background-image", void 0);
        this.setStyle("background-size", void 0);
        this.setStyle("background-repeat", void 0);
        this.setStyle("background-position", void 0);
      }
      (_a = this.sizeInput) == null ? void 0 : _a.silent(this.data.size);
      (_b = this.url) == null ? void 0 : _b.silent(this.data.url);
    }
  },
  text: class VText extends Visual {
    constructor(data = {}, sceneObject) {
      super("text", sceneObject);
      this.data = {
        text: "",
        bold: false,
        italic: false,
        alignment: "left",
        width: 0
      };
      this.set(data);
    }
    set(data) {
      super.set(data);
    }
  }
};
var SceneObjectComponentVisual = class extends SceneObjectComponent {
  constructor(type, data) {
    super("visual");
    this._position = v2();
    this.element = new DomElement("div", {
      className: "SceneObjectVisual"
    });
    this.toBuild = [data, VisualTypeDictionary[type]];
  }
  get position() {
    return this._position;
  }
  set position(value) {
    var _a;
    this._position = value;
    this.element.setStyle("left", "".concat(this._position[0], "px"));
    this.element.setStyle("top", "".concat(this._position[1], "px"));
    (_a = this.positionInput) == null ? void 0 : _a.silent(this._position);
  }
  updateState() {
    super.updateState();
    this.element.class(this.selected, "selected");
  }
  build() {
    super.build();
    this.panel = $.panels.getPanel("graphic");
    this.positionInput = this.sceneObject.defineProperty($.unique, {
      input: new PropsInputVector((v) => {
        this.position = v.c();
      }),
      name: "Position"
    });
    this.visual = new this.toBuild[1](this.toBuild[0], this.sceneObject);
    this.element.append(this.visual);
    $.mouse.registerDrag($.unique, {
      element: this.element,
      cursor: "move",
      reference: this.panel.graphic,
      initialTolerance: 400,
      start: () => {
        this.sceneObject.focus();
      },
      move: (e) => {
        if (e.e.ctrlKey && e.e.shiftKey) {
          this.position = e.relative.add(e.offset).scale(1 / this.panel.camera.scale).scale(0.04).floor().scale(25);
        } else if (e.e.ctrlKey) {
          this.position = e.relative.add(e.offset).scale(1 / this.panel.camera.scale).scale(0.1).floor().scale(10);
        } else if (e.e.shiftKey) {
          this.position = e.relative.add(e.offset).scale(1 / this.panel.camera.scale).scale(0.2).floor().scale(5);
        } else {
          this.position = e.relative.add(e.offset).scale(1 / this.panel.camera.scale).floor();
        }
      }
    });
    this.resizerKey = $.mouse.registerDrag($.unique, {
      element: this.element.child("span", {
        className: "resizer"
      }),
      reference: this.element,
      initialTolerance: 400,
      cursor: "nw-resize",
      start: () => {
        this.sceneObject.focus();
      },
      move: (e) => {
        if (e.e.ctrlKey && e.e.shiftKey) {
          this.visual.set({
            size: e.relative.scale(1 / this.panel.camera.scale).scale(0.04).floor().scale(25)
          });
        } else if (e.e.ctrlKey) {
          this.visual.set({
            size: e.relative.scale(1 / this.panel.camera.scale).scale(0.1).floor().scale(10)
          });
        } else if (e.e.shiftKey) {
          this.visual.set({
            size: e.relative.scale(1 / this.panel.camera.scale).scale(0.2).floor().scale(5)
          });
        } else {
          this.visual.set({
            size: e.relative.scale(1 / this.panel.camera.scale).floor()
          });
        }
      }
    });
  }
  add(parent) {
    this.delete();
    this.parent = parent;
    this.parent.append(this.element);
  }
  delete() {
    super.delete();
    if (this.parent) {
      this.parent.remove(this.element);
    }
  }
  update() {
    this.position = this.position;
    this.visual.set();
  }
};

// ts/sceneobjects/sceneobject.ts
var SceneObject = class {
  constructor({ key, type, data: visual, name }) {
    this.active = true;
    this._name = "";
    this._selected = false;
    this.properties = {};
    this.key = key || $.unique;
    this.name = name || "";
    this.createComponents(type, visual);
  }
  get name() {
    return this._name;
  }
  set name(value) {
    var _a;
    this._name = value;
    if ((_a = this.components) == null ? void 0 : _a.outline)
      this.components.outline.name = value;
  }
  get selected() {
    return this._selected;
  }
  set selected(value) {
    if (this._selected !== value) {
      this._selected = value;
      Object.values(this.components).forEach((c) => c.selected = value);
    }
  }
  get defineProperty() {
    return this.components.properties.add.bind(this.components.properties);
  }
  get undefineProperty() {
    return this.components.properties.remove.bind(this.components.properties);
  }
  get updateProperty() {
    return this.components.properties.update.bind(this.components.properties);
  }
  createComponents(type, visual) {
    this.components = {
      visual: new SceneObjectComponentVisual(type, visual),
      node: new SceneObjectComponentNode(),
      properties: new SceneObjectComponentProperties(),
      outline: new SceneObjectComponentOutline()
    };
    Object.values(this.components).forEach((c) => {
      c.sceneObject = this;
      c.selected = this.selected;
    });
  }
  resize() {
    Object.values(this.components).forEach((c) => {
      c.resize();
    });
  }
  delete() {
    Object.values(this.components).forEach((c) => {
      c.delete();
    });
  }
  focus() {
    $.scene.focus(this);
  }
  build() {
    var _a;
    Object.values(this.components).forEach((c) => {
      c.sceneObject = this;
    });
    this.components["outline"].build();
    this.components["properties"].build();
    this.components["visual"].build();
    this.components["node"].build();
    this.components["outline"].build();
    (_a = this.components["timeline"]) == null ? void 0 : _a.build();
    $.scene.update("all");
  }
};

// ts/sceneobjects/sceneobjectManager.ts
var SceneObjectManager = class {
  constructor(panels) {
    this.panels = panels;
    this.sceneObjects = {};
  }
  /** 
   * Adds a `SceneObject` to the scene 
   * @return Returns the `SceneObject`
  */
  add(n) {
    if (!n)
      return;
    const d = new SceneObject(n);
    this.sceneObjects[d.key] = d;
    d.build();
    this.update("outline");
    return n;
  }
  /** 
   * Removes a `SceneObject` to the scene 
   * @remarks This method will call the {@link SceneObject.delete() `delete()`} method on the sceneobject to ensure neat deletion. 
  */
  remove(n) {
    if (!n || !this.sceneObjects[n.key])
      return;
    n.delete();
    if (n === this.selected)
      this.focus();
    delete this.sceneObjects[n.key];
    this.update("all");
  }
  /** 
   * Handle a resizing window.
   * @remarks This method will call the {@link SceneObject.resize() `resize()`} method on all {@link SceneObject `sceneObjects`} in the scene. 
  */
  resize() {
    Object.values(this.sceneObjects).forEach((n) => {
      n.resize();
    });
  }
  /** 
   * Empty all {@link SceneObject `sceneObjects`} from the scene.
   * @remarks This method will call the {@link SceneObjectManager.remove() `remove()`} method on all {@link SceneObject sceneObjects} in the scene. 
  */
  clear() {
    Object.values(this.sceneObjects).forEach((n) => {
      this.remove(n);
    });
  }
  /** 
   * Bulk creates and adds multple {@link SceneObject `sceneObjects`} to the scene.
   * @remarks Often used for importing an entire scene
   * @param clear Should the {@link SceneObjectManager.clear() `clear()`} method be run to empty the scene? 
  */
  bulk(v, clear = false) {
    if (clear)
      this.clear();
    v.forEach((n) => {
      this.add(n);
    });
  }
  focus(s) {
    this.selected = void 0;
    Object.values(this.sceneObjects).forEach((n) => {
      n.selected = n === s;
      if (n.selected)
        this.selected = n;
    });
    $.state[this.selected ? "set" : "unset"]("selected");
    this.update("all");
  }
  getComponentsByType(type) {
    return Object.values(this.sceneObjects).map((so) => so.components[type]);
  }
  update(type = "all") {
    this.panels.outliner.update(Object.values(this.sceneObjects));
    if (type === "visual" || type === "all") {
      this.panels.graphic.update(this.getComponentsByType("visual"));
    }
    if (type === "properties" || type === "all") {
      const d = Object.values(this.sceneObjects).find((o) => o.selected);
      if (d) {
        this.panels.properties.update(d.components.properties);
      } else {
        this.panels.properties.update();
      }
    }
  }
  keyExists(n) {
    return Boolean(this.sceneObjects[n]);
  }
};

// ts/panels/library/libraryItem.ts
var LibraryItem = class extends DomElement {
  constructor(attr) {
    super("div", {
      className: "library_item",
      onClick: () => {
        attr.content.forEach((s, i) => $.scene.add(__spreadValues({}, s)));
      }
    });
    if (typeof attr.image === "string") {
      this.child("div", { className: "library_item_image", style: {
        "background-image": "url(".concat(attr.image, ")")
      } });
    } else {
      this.append(attr.image);
    }
    this.child("div", { className: "library_item_name", text: attr.name });
  }
};

// ts/panels/library/libraryPanel.ts
var LibraryPanel = class extends Panel {
  constructor(list = []) {
    super("library", "Library");
    this.icon = Icon.make("video_library");
    list.forEach((l) => {
      this.addCategories(l);
    });
  }
  addCategories([k, items]) {
    const w = this.content.child("div", { className: "library_category" });
    w.child("div", { className: "library_category_name", text: k });
    items.forEach((l) => {
      this.addItem(w, l);
    });
  }
  addItem(parent, l) {
    parent.append(new LibraryItem(l));
  }
};

// ts/main.ts
var Main = class {
  constructor() {
    $.main = this;
    $.mouse = new DragManager();
    $.panels = new PanelManager([
      new GraphicPanel(),
      new NodeEditorPanel(),
      new OutlinerPanel(),
      new PropertiesPanel(),
      new TimelinePanel(),
      new LibraryPanel([
        ["Images", [
          {
            image: new Icon({ name: "image" }),
            name: "Image",
            key: "image",
            content: [
              {
                name: "Image",
                type: "image",
                data: {
                  position: v2(0, 0),
                  size: v2(100, 100)
                }
              }
            ]
          },
          {
            image: new Icon({ name: "fullscreen" }),
            name: "Fullscreen",
            key: "fullscreen",
            content: [
              {
                name: "Fullscreen image",
                type: "image",
                data: {
                  position: v2(0, 0),
                  backgroundSize: "cover",
                  size: v2(505, 545)
                }
              }
            ]
          }
        ]],
        ["Templates", [{
          image: new Icon({ name: "grid_view" }),
          name: "Grid (2x2)",
          key: "template1",
          content: [
            {
              name: "Top left",
              type: "image",
              data: {
                position: v2(10, 35),
                size: v2(240, 240)
              }
            },
            {
              name: "Top right",
              type: "image",
              data: {
                position: v2(255, 35),
                size: v2(240, 240)
              }
            },
            {
              name: "Bottom left",
              type: "image",
              data: {
                position: v2(10, 280),
                size: v2(240, 240)
              }
            },
            {
              name: "Bottom right",
              type: "image",
              data: {
                position: v2(255, 280),
                size: v2(240, 240)
              }
            }
          ]
        }]]
      ])
    ]);
    $.windows = new WindowManager([
      new SettingsPanel(),
      new NotesPanel(),
      new ImportPanel(),
      new ExportPanel()
    ]);
    $.workspace = new WorkSpace({
      default: {
        name: "Builder",
        icon: Icon.make("space_dashboard"),
        data: [1, "h", 15, [2, "library"], [1, "h", 70, [2, "graphic"], [1, "v", 50, [2, "outliner"], [2, "properties"]]]]
      },
      grid: {
        name: "Grid",
        icon: Icon.make("window"),
        data: [1, "h", 50, [1, "v", 50, [0], [0]], [1, "v", 50, [0], [0]]]
      }
    });
    $.scene = new SceneObjectManager({
      graphic: $.panels.getPanel("graphic"),
      properties: $.panels.getPanel("properties"),
      node: $.panels.getPanel("node"),
      timeline: $.panels.getPanel("timeline"),
      outliner: $.panels.getPanel("outliner")
    });
    $.workspace.resize();
    $.panels.forEach(([k, p]) => p.build());
    setTimeout(() => {
      $.workspace.resize();
      $.panels.getPanel("graphic").camera.center();
    }, 1);
  }
  tick() {
  }
};

// ts/index.ts
var Glob = class {
  constructor() {
    this.state = new class state {
      constructor() {
        this.list = [];
      }
      set(n) {
        if (!this.list.includes(n)) {
          this.list.push(n);
          document.body.classList.add("state_".concat(n));
        }
      }
      unset(n) {
        if (this.list.includes(n)) {
          this.list.splice(this.list.indexOf(n), 1);
          document.body.classList.remove("state_".concat(n));
        }
      }
      check(n) {
        return this.list.includes(n);
      }
    }();
    this.uniqueIndex = 0;
  }
  get unique() {
    this.uniqueIndex++;
    return (this.uniqueIndex + 1e4).toString(16);
  }
};
window.$ = new Glob();
document.addEventListener("DOMContentLoaded", async () => {
  const g = new Main();
  document.body.appendChild($.workspace.domElement);
});
//# sourceMappingURL=index.js.map
