package vip.xiaonuo.client.modular.user.param;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * C端登录
 * @author gzj
 */
@Data
public class LoginParam {

    @NotBlank(message = "账号不能为空")
    public String account;

    @NotBlank(message = "密码不能为空")
    public String password;
}
