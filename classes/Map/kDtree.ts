class kdTree<T> {
    public leftChild: kdTree<T>;
    public rightChild: kdTree<T>;
    private median: number;
    public point: T;
    private axis: number;
    //private static best: ISearchNearestResult;

    constructor(points: Array<T>, depth: number = 0) {
        if (points.length == 1) {
            this.point = points[0];
            return;
        }
        this.axis = depth % 2;
        points.sort((a, b) => a[this.axis] - b[this.axis]); //TODO: presort instead?
        var medianElementIndex = Math.floor(points.length / 2);

        var leftPoints = points.splice(0, medianElementIndex);
        if (leftPoints.length > 0)
            this.leftChild = new kdTree(leftPoints, depth + 1);
        this.point = points.splice(0, 1)[0];
        this.median = this.point[this.axis];
        if (points.length > 0)
            this.rightChild = new kdTree(points, depth + 1);
    }

    public searchNearest(searchPoint: T): number {
        //kdTree.best = { dist: Number.MAX_VALUE, point: null };
        //this._searchNearest(searchPoint);


        //var test = this._searchNearest(searchPoint);
        //if (Math.floor(Math.sqrt(test.dist)) == 282) {
        //    alert('SP: ' + searchPoint)
        //    alert('OTHER' + test.point)
        //    alert('DIST: ' + Math.sqrt(test.dist))
        //}


        return Math.sqrt(this._searchNearest(searchPoint).dist);
    }

    private _searchNearest(searchPoint: T): ISearchNearestResult {
        if (!this.leftChild && !this.rightChild)
            return { dist: this.distSquared(searchPoint), point: this.point };
        
        var best: ISearchNearestResult;
        var child = searchPoint[this.axis] < this.median ? this.leftChild : this.rightChild;
        if (child)
            best = child._searchNearest(searchPoint);
        else 
            best = { dist: Number.MAX_VALUE, point: null }

        var dist = this.distSquared(searchPoint);
        if (dist < best.dist)
            best = { dist: dist, point: this.point };

        if (Math.pow(searchPoint[this.axis] - this.median, 2) < best.dist) {
            var otherChild = child == this.leftChild ? this.rightChild : this.leftChild;
            if (otherChild) {
                var maybeBetter = otherChild._searchNearest(searchPoint);
                if (maybeBetter.dist < best.dist)
                    return maybeBetter;
            }
        }

        return best;
    }

    private distSquared(other: T): number {
        var dist = Math.pow(this.point[0] - other[0], 2) + Math.pow(this.point[1] - other[1], 2);

        //if (Math.floor(dist) == 282) {
        //    alert('dist: ' + dist)
        //    alert('this: ' + this.point[0] + ' - ' + this.point[1]);
        //    alert('other: ' + other[0] + ' - ' + other[1]);
        //}

        return dist == 0 ? Number.MAX_VALUE : dist;
    }
}

class ISearchNearestResult {
    public point: any;
    public dist: number;
}


