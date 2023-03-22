package vip.xiaonuo.client.modular.user.service.impl;

import cn.hutool.captcha.CaptchaUtil;
import cn.hutool.captcha.CircleCaptcha;
import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.fhs.core.trans.anno.Trans;
import org.checkerframework.checker.units.qual.C;
import org.springframework.stereotype.Service;
import vip.xiaonuo.biz.modular.clientUser.entity.ClientUser;
import vip.xiaonuo.biz.modular.clientUser.service.ClientUserService;
import vip.xiaonuo.client.modular.user.param.AuthExceptionEnum;
import vip.xiaonuo.client.modular.user.param.LoginParam;
import vip.xiaonuo.client.modular.user.service.ClientLoginUserService;
import vip.xiaonuo.client.modular.user.service.TokenService;
import vip.xiaonuo.client.modular.user.vo.AuthPicValidCodeResult;
import vip.xiaonuo.common.cache.CommonCacheOperator;
import vip.xiaonuo.common.exception.CommonException;
import vip.xiaonuo.common.util.CommonCryptogramUtil;
import vip.xiaonuo.common.util.CommonIpAddressUtil;
import vip.xiaonuo.common.util.CommonServletUtil;

import javax.annotation.Resource;
import java.util.Date;

@Service
public class ClientLoginUserServiceImpl implements ClientLoginUserService {

    private static final String AUTH_CACHE_KEY = "auth-validCode:";

    @Resource
    private ClientUserService clientUserService;

    @Resource
    private CommonCacheOperator commonCacheOperator;

    @Resource
    private TokenService tokenService;

    @Override
    public String cLogin(LoginParam authAccountPasswordLoginParam) {
        String account = authAccountPasswordLoginParam.getAccount();
        String password = authAccountPasswordLoginParam.getPassword();
        // SM2解密并获得前端传来的密码哈希值
        String passwordHash;
        try {
            // 解密，并做哈希值
            passwordHash = CommonCryptogramUtil.doHashValue(CommonCryptogramUtil.doSm2Decrypt(password));
        } catch (Exception e) {
            throw new CommonException(AuthExceptionEnum.PWD_DECRYPT_ERROR.getValue());
        }
        ClientUser clientUser = clientUserService.getClientUserByAccount(account);
        if(ObjectUtil.isEmpty(clientUser)) {
            throw new CommonException(AuthExceptionEnum.ACCOUNT_ERROR.getValue());
        }
        if (!clientUser.getPassword().equals(passwordHash)) {
            throw new CommonException(AuthExceptionEnum.PWD_ERROR.getValue());
        }
        // 执行C端登录
        return execLoginC(clientUser);
    }

    @Override
    public String execLoginC(ClientUser clientUser) {
        //1. 记录登录日志
        clientUser.setLatestLoginIp(CommonIpAddressUtil.getIp(CommonServletUtil.getRequest()));
        clientUser.setLatestLoginAddress(CommonIpAddressUtil.getCityInfo(clientUser.getLastLoginIp()));
        clientUser.setLatestLoginTime(new Date());
        clientUser.setLastLoginIp(clientUser.getLatestLoginIp());
        clientUser.setLastLoginAddress(clientUser.getLatestLoginAddress());
        clientUser.setLastLoginTime(clientUser.getLatestLoginTime());
        clientUserService.saveOrUpdate(clientUser);
        //2.生成token并返回前端
        tokenService.setToken(clientUser);
        return tokenService.getToken();
    }

    @Override
    public AuthPicValidCodeResult getPicCaptcha() {
        // 生成验证码，随机4位字符
        CircleCaptcha circleCaptcha = CaptchaUtil.createCircleCaptcha(100, 38, 4, 10);
        // 定义返回结果
        AuthPicValidCodeResult authPicValidCodeResult = new AuthPicValidCodeResult();
        // 获取验证码的值
        String validCode = circleCaptcha.getCode();
        // 获取验证码的base64
        String validCodeBase64 = circleCaptcha.getImageBase64Data();
        // 生成请求号
        String validCodeReqNo = IdWorker.getIdStr();
        // 将base64返回前端
        authPicValidCodeResult.setValidCodeBase64(validCodeBase64);
        // 将请求号返回前端
        authPicValidCodeResult.setValidCodeReqNo(validCodeReqNo);
        // 将请求号作为key，验证码的值作为value放到redis，用于校验，5分钟有效
        commonCacheOperator.put(AUTH_CACHE_KEY + validCodeReqNo, validCode, 5 * 60);
        return authPicValidCodeResult;
    }

    @Override
    public ClientUser getLoginUser() {
        return tokenService.getUserByToken();
    }

    @Override
    public void doLogout() {
        tokenService.removeToken();
    }
}
