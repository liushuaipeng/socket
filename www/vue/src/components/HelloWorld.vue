<template>
    <div class="HelloWorld">
        <div class="add">
            <el-form label-position="right" label-width="80px" :model="formLabelAlign">
                <el-form-item label="名字">
                    <el-input v-model="formLabelAlign.name"></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="formLabelAlign.nickname"></el-input>
                </el-form-item>
                <el-form-item label="手机">
                    <el-input v-model="formLabelAlign.phone"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="add">add</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="list">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="name" label="名字" width="180">
                </el-table-column>
                <el-table-column prop="nickname" label="昵称" width="180">
                </el-table-column>
                <el-table-column prop="phone" label="手机">
                </el-table-column>
                <el-table-column prop="Date" label="时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="update(scope.row)">修改</el-button>
                        <el-button type="text" @click="remove(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: "HelloWorld",
    data() {
        return {
            labelPosition: "right",
            formLabelAlign: {
                id: null,
                name: "",
                nickname: "",
                phone: ""
            },
            tableData: []
        };
    },
    methods: {
        add() {
            var _self = this;
            if (this.formLabelAlign.id) {
                this.$http.post("/mongo/update", this.formLabelAlign).then(res => {
                    ["id", "name", "nickname", "phone"].forEach(key => {
                        _self.formLabelAlign[key] = "";
                    });
                    this.getData();
                });
            } else {
                this.$http.post("/mongo/add", this.formLabelAlign).then(res => {
                    ["id", "name", "nickname", "phone"].forEach(key => {
                        _self.formLabelAlign[key] = "";
                    });
                    this.getData();
                });
            }
        },
        getData() {
            this.$http.get("/mongo/getdata").then(res => {
                this.tableData = res.data.data.list;
            });
        },
        update(data) {
            var _self = this;
            ["id", "name", "nickname", "phone"].forEach(key => {
                _self.formLabelAlign[key] = data[key];
            });
        },
        remove(id) {
            console.log(id);
            this.$http.post("/mongo/remove", { id: id }).then(res => {
                this.getData();
            });
        }
    },
    created: function() {
        this.getData();
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.HelloWorld {
    display: flex;
}
.add {
    flex: 0 0 300px;
}
.list {
    flex: 1;
    padding: 20px;
}
</style>
