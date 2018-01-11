<template>
    <div>
        <el-upload ref="upload" action="http://localhost:3000/files/upload" name="files" list-type="picture-card" :on-preview="handlePictureCardPreview" :auto-upload="false" :on-success="handleSuccess" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogImageUrl: "",
            dialogVisible: false
        };
    },
    methods: {
        submitUpload() {
            this.$refs.upload.submit();
            console.log("开始上传");
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handleSuccess(res, file, fileList) {
            console.log(res);
            console.log(fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        }
    }
};
</script>


