package vip.xiaonuo.client.modular.user.controller;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vip.xiaonuo.biz.modular.clientUser.entity.ClientUser;
import vip.xiaonuo.client.modular.user.param.LoginParam;
import vip.xiaonuo.client.modular.user.service.ClientLoginUserService;
import vip.xiaonuo.client.modular.user.vo.AuthPicValidCodeResult;
import vip.xiaonuo.common.pojo.CommonResult;

import javax.annotation.Resource;
import javax.validation.Valid;

@RestController
@RequestMapping("/app")
public class ClientLoginController {
    @Resource
    private ClientLoginUserService clientLoginUserService;
    /**
     * C端账号密码登录
     *
     * @author gzj
     * @date 2023年3月20日15:03:50
     **/
    @ApiOperationSupport(order = 3)
    @PostMapping("/auth/c/doLogin")
    public CommonResult<String> doLogin(@RequestBody @Valid LoginParam loginParam) {
        return CommonResult.data(clientLoginUserService.cLogin(loginParam));
    }
    /**
     * C端获取图片验证码
     *
     * @author xuyuxiang
     * @date 2022/7/8 9:26
     **/
    @ApiOperationSupport(order = 1)
    @GetMapping("/auth/b/getPicCaptcha")
    public CommonResult<AuthPicValidCodeResult> getPicCaptcha() {
        return CommonResult.data(clientLoginUserService.getPicCaptcha());
    }
    /**
     * C端获取图片验证码
     *
     * @author xuyuxiang
     * @date 2022/7/8 9:26
     **/
    @ApiOperationSupport(order = 1)
    @GetMapping("/auth/getLoginUser")
    public CommonResult<ClientUser> getLoginUser() {
        return CommonResult.data(clientLoginUserService.getLoginUser());
    }
    /**
     * C端获取图片验证码
     *
     * @author xuyuxiang
     * @date 2022/7/8 9:26
     **/
    @ApiOperationSupport(order = 1)
    @GetMapping("/auth/doLogout")
    public CommonResult doLogout() {
        clientLoginUserService.doLogout();
        return CommonResult.ok();
    }

}
