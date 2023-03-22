package vip.xiaonuo.client.modular.user.service;

import vip.xiaonuo.biz.modular.clientUser.entity.ClientUser;
import vip.xiaonuo.client.modular.user.param.LoginParam;
import vip.xiaonuo.client.modular.user.vo.AuthPicValidCodeResult;

public interface ClientLoginUserService {

    /**
     * C端登录
     * @param authAccountPasswordLoginParam
     * @return
     */
    String cLogin(LoginParam authAccountPasswordLoginParam);

    /**
     * 执行C端登录操作
     * @param clientUser
     * @return
     */
    String execLoginC(ClientUser clientUser);

    /**
     * C端验证验获取
     * @return
     */
    AuthPicValidCodeResult getPicCaptcha();

    /**
     * 获取当前登录用户信息
     * @return
     */
    ClientUser getLoginUser();

    /**
     * 退出登录
     */
    void doLogout();
}
