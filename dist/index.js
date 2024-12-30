// ts/dom/domElement.ts
var DomElement = class {
  set visible(b) {
    this.setStyleProperty("display", b ? void 0 : "none", true);
  }
  constructor(type, properties = {}) {
    this.domElement = document.createElement(type);
    this.domElement.setAttribute("draggable", "false");
    this.domElement.addEventListener("click", this.click.bind(this));
    if (properties.style)
      Object.entries(properties == null ? void 0 : properties.style).forEach(([k, v]) => {
        this.setStyleProperty(
          k,
          typeof v === "string" ? v : v[0],
          typeof v === "string" ? false : v[1]
        );
      });
    if (properties.attr)
      Object.entries(properties == null ? void 0 : properties.attr).forEach(([k, v]) => {
        this.domElement.setAttribute(k, v);
      });
    if (properties.text)
      this.domElement.innerHTML = properties.text;
    if (properties.className)
      this.domElement.className = properties.className;
    if (properties.id)
      this.domElement.id = properties.id;
  }
  setStyleProperty(k, v, i = false) {
    if (v) {
      this.domElement.style.setProperty(k, v, i ? "important" : "");
    } else {
      this.domElement.style.removeProperty(k);
    }
  }
  append(d) {
    this.domElement.appendChild(d.domElement);
    return d;
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
};

// ts/utilities/utils.ts
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
  get dragging() {
    return this._dragging;
  }
  set dragging(value) {
    this._dragging = value;
    this.dragger.setStyleProperty("pointerEvents", value ? "none" : "auto");
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
      this.sections[0].setStyleProperty(this.direction === "h" ? "width" : "height", "calc(".concat(this._percentage, "% - 3px)"));
      this.sections[1].setStyleProperty(this.direction === "h" ? "width" : "height", "calc(".concat(100 - this._percentage, "% - 3px)"));
      this.sections[0].setStyleProperty(this.direction === "h" ? "height" : "width", "100%");
      this.sections[1].setStyleProperty(this.direction === "h" ? "height" : "width", "100%");
      this.dragger.setStyleProperty("left", this.direction === "h" ? "calc(".concat(this._percentage, "% - 3px)") : "4px");
      this.dragger.setStyleProperty("top", this.direction === "v" ? "calc(".concat(this._percentage, "% - 3px)") : "4px");
    }
  }
  get activePanel() {
    return this.panel;
  }
  setMode(m, a, b) {
    var _a;
    const oldPanel = this.panel;
    this.empty();
    this.mode = m;
    if (this.mode === "panel") {
      this.domElement.classList.remove("s_split");
      this.domElement.classList.add("s_panel");
      this.panel = glob.panels.getPanel(a);
      glob.panels.assign(this.panel, this);
      this.panelSwitch.value((_a = this.panel) == null ? void 0 : _a.id);
      this.dragger.visible = false;
      return this.panel;
    } else {
      this.domElement.classList.remove("s_panel");
      this.domElement.classList.add("s_split");
      this.sections = [
        new _Section(this),
        new _Section(this)
      ];
      this.sections[0].setMode("panel", oldPanel == null ? void 0 : oldPanel.name);
      this.direction = a;
      this.percentage = b;
      this.dragger.visible = true;
      return this.sections;
    }
  }
  removePanel() {
    if (this.panel) {
      this.contentWrap.remove(this.panel);
      this.panel = void 0;
    }
    this.panelSwitch.value("empty");
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
      (_b = this.parent) == null ? void 0 : _b.remove(this);
    }
  }
  constructor(parent) {
    super("div", {
      className: "section"
    });
    if (parent) {
      this.parent = parent;
      this.parent.contentWrap.append(this);
    }
    this.build();
    this.setMode("panel", void 0);
  }
  build() {
    this.contentWrap = this.append(new DomElement("div", { className: "section_content" }));
    this.append(new DomElement("div", {
      className: "section_outline"
    }));
    this.dragger = this.append(new DomElement("span", {
      className: "section_dragger"
    }));
    this.dragger.append(new DomElement("div", {
      className: "section_dragger_collapse"
    }));
    this.domElement.addEventListener("mousemove", this.resize.bind(this));
    this.dragger.domElement.addEventListener("mousedown", () => this.dragging = true);
    this.dragger.domElement.addEventListener("mouseup", () => this.dragging = false);
    this.domElement.addEventListener("mouseup", () => this.dragging = false);
    this.panelSwitch = this.append(glob.panels.getSelectObject());
    this.panelSwitch.onChange = (v) => {
      this.setMode("panel", v);
    };
  }
  resize(e) {
    if (this.dragging) {
      let v;
      if (this.direction === "v") {
        v = (e.y - this.domElement.offsetTop) / this.domElement.offsetHeight * 100;
      } else {
        v = (e.x - this.domElement.offsetLeft) / this.domElement.offsetWidth * 100;
      }
      if (v !== 0)
        this.percentage = Util.clamp(v, 0, 100);
    }
  }
};

// ts/interface/interface.ts
var Interface = class extends DomElement {
  constructor() {
    super("div", {
      className: "content"
    });
    this.mainSection = new Section();
    this.append(this.mainSection);
  }
  build() {
    this.setPreset();
  }
  setPreset() {
    this.mainSection.empty();
    const [t, b] = this.mainSection.setMode("split", "v", 50);
    const [tl, tr] = t.setMode("split", "h", 70);
    const [trt, trb] = tr.setMode("split", "v", 50);
    b.setMode("panel", "timeline");
    tl.setMode("panel", "main");
    trt.setMode("panel", "outliner");
    trb.setMode("panel", "properties");
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
  }
};

// ts/interface/panels/main.ts
var MainPanel = class extends Panel {
  constructor() {
    super("main", "Main");
  }
};

// ts/interface/panels/node.ts
var NodeEditorPanel = class extends Panel {
  constructor() {
    super("node", "Node");
  }
};

// ts/interface/panels/outliner.ts
var OutlinerPanel = class extends Panel {
  constructor() {
    super("outliner", "Outliner");
  }
};

// ts/dom/select.ts
var Select = class extends DomElement {
  constructor(props = {}) {
    super("div", { className: "input select" });
    this.select = this.append(new DomElement("select"));
    this.onChange = props.onChange;
    if (props.options)
      Object.entries(props.options).forEach(([k, v]) => {
        this.addOption(k, v, props.default === k);
      });
    this.select.domElement.addEventListener("change", () => {
      this.change(this.select.domElement.value);
    });
  }
  value(v) {
    this.select.domElement.value = v;
  }
  change(v) {
    var _a;
    (_a = this.onChange) == null ? void 0 : _a.call(this, v);
  }
  addOption(k, v, d = false) {
    this.select.append(new DomElement("option", {
      attr: {
        value: k,
        selected: d ? "" : void 0
      },
      text: v
    }));
  }
};

// ts/interface/panels/panelManager.ts
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
  getSelectObject() {
    return new Select({
      options: Object.fromEntries([["empty", ""], ...Object.entries(this.list).map(([k, v]) => {
        return [k, v.panel.name];
      })])
    });
  }
};

// ts/interface/panels/properties.ts
var PropertiesPanel = class extends Panel {
  constructor() {
    super("properties", "Properties");
  }
};

// ts/interface/panels/timeline.ts
var TimelinePanel = class extends Panel {
  constructor() {
    super("timeline", "Timeline");
  }
};

// ts/main.ts
var Glob = class {
};
var glob = new Glob();
var Main = class {
  constructor() {
    this.glob = glob;
    glob.main = this;
    glob.panels = new PanelManager([
      new MainPanel(),
      new NodeEditorPanel(),
      new OutlinerPanel(),
      new PropertiesPanel(),
      new TimelinePanel()
    ]);
    glob.interface = new Interface();
    this.build();
  }
  build() {
    glob.interface.build();
  }
  tick() {
  }
};

// ts/index.ts
document.addEventListener("DOMContentLoaded", async () => {
  const g = new Main();
  document.body.appendChild(g.glob.interface.domElement);
});
//# sourceMappingURL=index.js.map
