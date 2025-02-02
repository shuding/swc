export const E = {
    set: function(t, e) {
        e = _.defaults({}, e, setOptions);
        if (e.parse) t = this.parse(t, e);
        var i = !_.isArray(t);
        t = i ? (t ? [
            t
        ] : []) : _.clone(t);
        var s, r, h, l, o, a, n;
        var f = e.at;
        var d = this.model;
        var g = this.comparator && f == null && e.sort !== false;
        var p = _.isString(this.comparator) ? this.comparator : null;
        var u = [], v = [], c = {};
        var m = e.add, b = e.merge, y = e.remove;
        var M = !g && m && y ? [] : false;
        for(s = 0, r = t.length; s < r; s++){
            o = t[s];
            if (o instanceof Model) {
                h = l = o;
            } else {
                h = o[d.prototype.idAttribute];
            }
            if ((a = this.get(h))) {
                if (y) c[a.cid] = true;
                if (b) {
                    o = o === l ? l.attributes : o;
                    if (e.parse) o = a.parse(o, e);
                    a.set(o, e);
                    if (g && !n && a.hasChanged(p)) n = true;
                }
                t[s] = a;
            } else if (m) {
                l = t[s] = this._prepareModel(o, e);
                if (!l) continue;
                u.push(l);
                l.on("all", this._onModelEvent, this);
                this._byId[l.cid] = l;
                if (l.id != null) this._byId[l.id] = l;
            }
            if (M) M.push(a || l);
        }
        if (y) {
            for(s = 0, r = this.length; s < r; ++s){
                if (!c[(l = this.models[s]).cid]) v.push(l);
            }
            if (v.length) this.remove(v, e);
        }
        if (u.length || (M && M.length)) {
            if (g) n = true;
            this.length += u.length;
            if (f != null) {
                for(s = 0, r = u.length; s < r; s++){
                    this.models.splice(f + s, 0, u[s]);
                }
            } else {
                if (M) this.models.length = 0;
                var A = M || u;
                for(s = 0, r = A.length; s < r; s++){
                    this.models.push(A[s]);
                }
            }
        }
        if (n) this.sort({
            silent: true
        });
        if (!e.silent) {
            for(s = 0, r = u.length; s < r; s++){
                (l = u[s]).trigger("add", l, this, e);
            }
            if (n || (M && M.length)) this.trigger("sort", this, e);
        }
        return i ? t[0] : t;
    }
};
