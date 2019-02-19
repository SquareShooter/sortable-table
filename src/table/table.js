export class Table {
    constructor({el}) {
        this.el = el;
        this.data = [];

        this.el.innerHTML = `
            <div class="table-wrap">
                <h2 class="table-title">Render a sortable table based on json data</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th data-sort-by="name">Name</th>
                            <th data-sort-by="surname">Surname</th>
                            <th data-sort-by="age">Age</th>
                        </tr>
                    </thead>
                    <tbody></tbody>       
                </table>
            </div>
        `;
    }

    _loadData(cb) {
        let xhr = new XMLHttpRequest();

        xhr.overrideMimeType("application/json");
        xhr.open('GET', 'table.json', true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                cb(xhr.responseText);
            }
        };
        xhr.send(null);
    }

    _convertData() {
        this._loadData((response) => {
            let data = JSON.parse(response),
                cellsData = data['users'];

            localStorage.setItem(cellsData, JSON.stringify(data));

            data = JSON.parse(localStorage.getItem(cellsData));

            for (let item of cellsData) {
                this.data.push(item);
            }
        });
    }

    _printTable(data) {
        let tbody = this.el.querySelector('tbody');

        data.forEach((item) => {
            let tdName = document.createElement('td'),
                tdSurname = document.createElement('td'),
                tdAge = document.createElement('td');

            tdName.textContent = item['name'];
            tdSurname.textContent = item['surname'];
            tdAge.textContent = item['age'];

            for (let i = 0; i < data.length; i++) {
                let tr = document.createElement('tr');

                tr.append(tdName, tdSurname, tdAge);
                tbody.appendChild(tr);
            }
        });
    }

    _clearTable() {
        let tbody = this.el.querySelector('tbody');

        tbody.innerHTML = '';
    }

    _addDataToTable() {
        this._loadData(() => {
            let cellsData = this.data;

            if (!cellsData.length) {
                this.el.innerHTML = `
                    <div class="no-data">
                        <h2>Sorry, no data</h2>
                        <div class="img-wrap">
                            <img src="../src/img/dolgopyat.jpg" />
                        </div>
                    </div>
                `;
            }

            this._printTable(cellsData);
        });
    }


    sortTable() {
        this.el.onclick = (event) => {
            this._clearTable();

            let eventTarget = event.target,
                th = this.el.querySelectorAll('th'),
                thAttr = eventTarget.getAttribute('data-sort-by');

            for (let elem of th) {
                elem.classList.remove('selected');
            }

            if (eventTarget.tagName === 'TH') {
                eventTarget.classList.add('selected');
            }

            if (thAttr) {
                let first = this.data[0];

                this.data.sort(function(a, b) {
                    return a[thAttr] > b[thAttr] ? 1 : a[thAttr] < b[thAttr] ? -1 : 0
                });

                if (first === this.data[0]) {
                    this.data.reverse();
                    eventTarget.classList.remove('ascending');
                } else {
                    eventTarget.classList.add('ascending');
                }
            }

            this._printTable(this.data);
        };
    }

    render() {
        this._convertData();
        this._addDataToTable();
        this.sortTable();
    }
}