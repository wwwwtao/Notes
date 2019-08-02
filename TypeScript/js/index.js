"use strict";
var passcode = 'secret passcode';
var Employee = /** @class */ (function () {
    function Employee() {
    }
    Object.defineProperty(Employee.prototype, "fullName", {

         //  使用 且 只能使用 defineProperty 定义访问器属性(存取器 默认为undefined)进行存取 
        get: function () {
            return this._fullName;
        },
        set: function (newName) {
            if (passcode && passcode == 'secret passcode') {
                this._fullName = newName;
            }
            else {
                console.log('Error: Unauthorized update of employee!');
            }
        },
        enumerable: true, //可以循环
        configurable: true //可以删除 
        // 使用defineProperty创建的对象特性默认为false
        // 故Writable  为false 不能修改属性的值
    });
    return Employee;
}());
var employee = new Employee();
employee.fullName = 'Bob Smith';
if (employee.fullName) {
    console.log(employee.fullName);
}
