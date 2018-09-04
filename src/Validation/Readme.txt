class FormValidation 的使用方式：

1.在所需頁面的component類別中的 constructor 中new出實體，並且要在實體的constructor參數中放入component的this
    例如：
    ...
    ...
    export default class SmsManagement extends React.Component {
      constructor(props) {
        ...
        ...
        this.validation = new FormValidation(this)
      }
      ...
      ...
      ...
    }

2.在所需要顯示驗證結果的地方使用 validate 方法 + showValidationAlert方法
    例如：
    <input type="text" name="smsContent" />
    {this.validation.validate('smsContent').showValidationAlert()}

3.validate方法：
    選擇驗證類別對指定的值進行驗證，
    validate(field, value, customizedMessage)

    field：驗證的類別名稱

    value：需要驗證的值，若驗證類別名稱等於需要驗證欄位的name值，則可省略。
           可使用陣列帶入其他需要的參數，陣列第一個值為需要驗證的值。

    customizedMessage：可更改驗證失敗時顯示的訊息。
                       可使用陣列更改不同驗證錯誤下顯示的訊息。

    回傳值：物件：{ validate: (func), getApiError: (func), showValidationAlert: (func), getMessages: (func), result: (bool) }

4.getApiError方法：
    必須先使用setApiErrorsObject方法。
    此方法可將ＡＰＩ回傳的錯誤納入驗證錯誤結果中，
    getApiError(key, customizedMessage)

    key：哪個ＡＰＩ傳送參數導致錯誤
    customizedMessage：可更改顯示的錯誤訊息

    回傳值：物件：{ getApiError: (func), showValidationAlert: (func), getMessages: (func) }

5.showValidationAlert方法：
    顯示出驗證錯誤內容，
    必須接在validate或getApiError方法後，
    showValidationAlert(show)

    show：'first' or 'all' 顯示出第一個錯誤訊息或是全部錯誤訊息，若省略該參數則預設'first'

    回傳值：react的物件，可以render在頁面上的錯誤訊息

6.getMessages方法：
    取得驗證錯誤內容，
    必須接在validate或getApiError方法後。

    回傳值：此驗證所有錯誤訊息的陣列

7.setApiErrorsObject方法：
    將ＡＰＩ回傳的錯誤訊息物件放入此驗證實體中
    setApiErrorsObject(obj)
    例如：this.validation.setApiErrorsObject(this.props.utilities.validation)
    建議使用位置在render方法的開頭處

8.getValidationResult方法
    取得整個實體的所有驗證結果，全部驗證通過為true否則為false
    回傳值為Promise物件，必須在方法後使用.then來接值
    例如：this.validation.getValidationResult().then(
            () => {
            ...驗證成功...
            }, () => {
            ...驗證失敗...
            })

9.hideValidation方法
    隱藏所有驗證結果的錯誤訊息，當使用getValidationResult方法或freshValidations方法時會取消隱藏

10.關於驗證類別：
    所有驗證類別會放在ValidationType.js的檔案下，
    可自行新增驗證類別，
    一個類別下可放入多個驗證物件，
    每個驗證物件內容必須包含三樣 {method, valid, message}
    method: 驗證方法：
        可帶入兩個參數，第一個參數為需要驗證的值，第二個參數為陣列，就是當validate方法的value為陣列時的值，
        必須設定回傳值。
    valid: 驗證後的通過判定，若method驗證方法的回傳值等於此valid值，則代表這個驗證通過。
    message: 當此驗證不通過時，對應的錯誤訊息，訊息方法：第一個參數為陣列，就是當validate方法的value為陣列時的值。

11.錯誤訊息的顯示樣式放在ValidationAlert.jsx中
