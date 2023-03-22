package vip.xiaonuo.client.core.constanst;

/**
 * @description 缓存相关常量
 * @author gzj
 */
public interface CacheConstanst {
    /**
     * C端登录token缓存前缀
     */
    String CLIENT_TOKEN_PREFIX = "client:login:token:";
    /**
     * C端登录token缓存时间（7天）
     */
    Long CLIENT_TOKEN_EXPIRE = 60 * 60 * 24 *7L ;
}
