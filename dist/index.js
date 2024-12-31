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
    this.domElement.addEventListener("click", this.click.bind(this));
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
    var _a;
    super("span", {
      text: properties.name,
      className: "icon material-symbols-outlined",
      style: {
        "font-weight": String((_a = properties.weight) != null ? _a : 400)
      }
    });
  }
  static make(n, w) {
    return {
      name: n || "",
      weight: w || 200
    };
  }
};

// ts/lib/dom/button.ts
var Button = class extends DomElement {
  constructor(properties = {}) {
    var _a;
    super("button", __spreadValues(__spreadValues({}, properties), {
      text: void 0,
      className: ((_a = properties.className) != null ? _a : "") + " button"
    }));
    this._enabled = true;
    this._active = false;
    if (properties.icon)
      this.append(new Icon(properties.icon));
    if (properties.unstyle)
      this.domElement.classList.add("unstyle");
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
  constructor(button, d) {
    super("div", { className: "menu_panel" });
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
        text: a.name,
        onClick: () => {
          a.onClick();
          this.open = false;
        },
        icon: a.icon,
        unstyle: true
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
  constructor(button, c, d) {
    super(button, d.map((c2) => c2.map((v) => {
      if (typeof v === "string")
        return v;
      return {
        key: v.key,
        name: v.name,
        onClick: () => this.value(v.key),
        icon: v.icon
      };
    })));
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
    this.button.setText(foundText + "...");
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
    const menuWrap = this.child("div", { className: "menu_wrap" });
    let button, panel;
    if (data.type === "Action") {
      button = menuWrap.append(new Button({
        onClick: data.onClick,
        icon: data.icon,
        text: data.label
      }));
    }
    if (data.type === "Select") {
      button = menuWrap.append(new Button({
        icon: data.icon,
        text: data.label + "...",
        onClick: () => {
          panel.toggle();
        }
      }));
      panel = menuWrap.append(new MenuS(button, data.onChange, data.data));
    }
    if (data.type === "Panel") {
      button = menuWrap.append(new Button({
        icon: data.icon,
        text: data.label + "...",
        onClick: () => {
          panel.toggle();
        }
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
      panel: glob.panels.getPanel(n)
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
    if (this.sections && this.direction) {
      this.sections[0].setStyle(this.direction === "h" ? "width" : "height", "calc(".concat(this._percentage, "% - 3px)"));
      this.sections[1].setStyle(this.direction === "h" ? "width" : "height", "calc(".concat(100 - this._percentage, "% - 3px)"));
      this.sections[0].setStyle(this.direction === "h" ? "height" : "width", "100%");
      this.sections[1].setStyle(this.direction === "h" ? "height" : "width", "100%");
      this.dragger.setStyle("left", this.direction === "h" ? "calc(".concat(this._percentage, "% - 3px)") : "4px");
      this.dragger.setStyle("top", this.direction === "v" ? "calc(".concat(this._percentage, "% - 3px)") : "4px");
    }
  }
  get activePanel() {
    return this.panel;
  }
  setMode(m, a, b) {
    const oldPanel = this.panel;
    if (m === "panel") {
      this.fill({
        type: "panel",
        panel: glob.panels.getPanel(a)
      });
      return this.panel;
    } else {
      this.fill({
        type: "split",
        sections: [
          {
            type: "panel",
            panel: oldPanel
          },
          _Section.getEmpty()
        ],
        percentage: b,
        direction: a
      });
      return this.sections;
    }
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
    glob.panels.unassign(this);
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
        glob.panels.assign(this.panel, this);
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
      this.setMode("panel", "empty");
    }
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
    this.domElement.addEventListener("mousemove", this.resize.bind(this));
    this.dragger.domElement.addEventListener("mousedown", () => this.dragging = true);
    this.dragger.domElement.addEventListener("mouseup", () => this.dragging = false);
    this.domElement.addEventListener("mouseup", () => this.dragging = false);
    this.sectionMenu = this.append(new Menu([
      glob.panels.getSelectObject("panel", (v) => {
        this.setMode("panel", v);
      })
    ]));
    this.panelSwitch = this.sectionMenu.getButton("panel").panel;
  }
  resize(e) {
    if (this.dragging) {
      let v = this.direction === "v" ? (e.y - this.domElement.getBoundingClientRect().y) / this.domElement.offsetHeight * 100 : (e.x - this.domElement.getBoundingClientRect().x) / this.domElement.offsetWidth * 100;
      if (v !== 0)
        this.percentage = Util.clamp(v, 0, 100);
    }
  }
};

// ts/interface/interface.ts
var WorkSpace = class extends DomElement {
  constructor(presets) {
    super("div", {
      className: "content"
    });
    this.buildToolbar(presets);
    this.mainSection = this.append(new Section());
    this.setPreset(presets ? Object.keys(presets)[0] : "empty");
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
        label: "File",
        type: "Panel",
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
          { key: "saveas", name: "Save As...", icon: Icon.make("file_save"), onClick: () => {
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
        label: "Edit",
        type: "Panel",
        data: [[
          { key: "undo", name: "Undo", icon: Icon.make("undo"), onClick: () => {
          } },
          { key: "redo", name: "Redo...", icon: Icon.make("redo"), onClick: () => {
          } },
          { key: "options", name: "Options...", icon: Icon.make("settings"), onClick: () => {
          } }
        ]]
      },
      {
        key: "workspace",
        label: "Workspace",
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
  getSelectObject(key = "panel", onChange) {
    return {
      key: "panel",
      label: "Panel",
      icon: { name: "dashboard", weight: 200 },
      type: "Select",
      onChange,
      data: [[{ key: "empty", name: "Empty" }, ...Object.entries(this.list).map(([k, v]) => {
        return { key: k, name: v.panel.name };
      })]]
    };
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
    this.child("div", {
      text: name,
      style: {
        "color": "white"
      }
    });
  }
};

// ts/panels/main.ts
var MainPanel = class extends Panel {
  constructor() {
    super("main", "Main");
  }
};

// ts/panels/node.ts
var NodeEditorPanel = class extends Panel {
  constructor() {
    super("node", "Node");
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

// ts/main.ts
var Main = class {
  constructor() {
    glob.main = this;
    glob.panels = new PanelManager([
      new MainPanel(),
      new NodeEditorPanel(),
      new OutlinerPanel(),
      new PropertiesPanel(),
      new TimelinePanel()
    ]);
    glob.interface = new WorkSpace({
      default: {
        name: "Default",
        data: [1, "v", 50, [1, "h", 70, [2, "main"], [1, "v", 50, [2, "outliner"], [2, "properties"]]], [2, "timeline"]]
      }
    });
    this.build();
  }
  build() {
  }
  tick() {
  }
};

// ts/index.ts
var Glob = class {
};
window.glob = new Glob();
window.log = console.log;
document.addEventListener("DOMContentLoaded", async () => {
  const g = new Main();
  document.body.appendChild(glob.interface.domElement);
});
//# sourceMappingURL=index.js.map
