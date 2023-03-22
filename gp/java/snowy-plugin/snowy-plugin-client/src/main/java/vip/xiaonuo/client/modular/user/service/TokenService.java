package vip.xiaonuo.client.modular.user.service;

import vip.xiaonuo.biz.modular.clientUser.entity.ClientUser;

public interface TokenService {
    /**
     * 设置token
     * @param clientUser
     * @return
     */
    void setToken(ClientUser clientUser);

    /**
     * 获取token
      * @return
     */
    String getToken();

    /**
     * 移除token
     */
    void removeToken();

    /**
     * 根据当前token获取用户
     * @return
     */
    ClientUser getUserByToken();
}
