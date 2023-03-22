package vip.xiaonuo.client.modular.user.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.lang.UUID;
import org.springframework.stereotype.Service;
import vip.xiaonuo.biz.modular.clientUser.entity.ClientUser;
import vip.xiaonuo.client.core.constanst.CacheConstanst;
import vip.xiaonuo.client.modular.user.service.TokenService;
import vip.xiaonuo.common.cache.CommonCacheOperator;

import javax.annotation.Resource;

/**
 * @author c端token接口
 */
@Service
public class TokenServiceImpl implements TokenService {

    @Resource
    private CommonCacheOperator commonCacheOperator;
    private String uudid;


    @Override
    public void setToken(ClientUser clientUser) {
        flashUUid();
        commonCacheOperator.put(CacheConstanst.CLIENT_TOKEN_PREFIX + getUUid(),clientUser,CacheConstanst.CLIENT_TOKEN_EXPIRE);
    }

    @Override
    public String getToken() {
        return getUUid();
    }

    @Override
    public void removeToken() {
        commonCacheOperator.remove(CacheConstanst.CLIENT_TOKEN_PREFIX + getUUid());
    }

    @Override
    public ClientUser getUserByToken() {
        ClientUser clientUser = new ClientUser();
        String token = CacheConstanst.CLIENT_TOKEN_PREFIX + getToken();
        Object o = commonCacheOperator.get(token);
        BeanUtil.copyProperties(o,clientUser);
        return clientUser;
    }

    private void flashUUid(){
        this.uudid = UUID.fastUUID().toString();
    }
    private String getUUid(){
        return uudid;
    }
}
