/*
 * Copyright [2022] [https://www.xiaonuo.vip]
 *
 * Snowy采用APACHE LICENSE 2.0开源协议，您在使用过程中，需要注意以下几点：
 *
 * 1.请不要删除和修改根目录下的LICENSE文件。
 * 2.请不要删除和修改Snowy源码头部的版权声明。
 * 3.本项目代码可免费商业使用，商业使用请保留源码和相关描述文件的项目出处，作者声明等。
 * 4.分发源码时候，请注明软件出处 https://www.xiaonuo.vip
 * 5.不可二次分发开源参与同类竞品，如有想法可联系团队xiaonuobase@qq.com商议合作。
 * 6.若您的项目无法满足以上几点，需要更多功能代码，获取Snowy商业授权许可，请在官网购买授权，地址为 https://www.xiaonuo.vip
 */
package vip.xiaonuo.biz.modular.clientUser.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import vip.xiaonuo.biz.modular.clientUser.entity.ClientUser;
import vip.xiaonuo.biz.modular.clientUser.param.ClientUserAddParam;
import vip.xiaonuo.biz.modular.clientUser.param.ClientUserEditParam;
import vip.xiaonuo.biz.modular.clientUser.param.ClientUserIdParam;
import vip.xiaonuo.biz.modular.clientUser.param.ClientUserPageParam;

import java.util.List;

/**
 * C端用户Service接口
 *
 * @author gzj
 * @date  2023/03/20 11:17
 **/
public interface ClientUserService extends IService<ClientUser> {

    /**
     * 获取C端用户分页
     *
     * @author gzj
     * @date  2023/03/20 11:17
     */
    Page<ClientUser> page(ClientUserPageParam clientUserPageParam);

    /**
     * 添加C端用户
     *
     * @author gzj
     * @date  2023/03/20 11:17
     */
    void add(ClientUserAddParam clientUserAddParam);

    /**
     * 编辑C端用户
     *
     * @author gzj
     * @date  2023/03/20 11:17
     */
    void edit(ClientUserEditParam clientUserEditParam);

    /**
     * 删除C端用户
     *
     * @author gzj
     * @date  2023/03/20 11:17
     */
    void delete(List<ClientUserIdParam> clientUserIdParamList);

    /**
     * 获取C端用户详情
     *
     * @author gzj
     * @date  2023/03/20 11:17
     */
    ClientUser detail(ClientUserIdParam clientUserIdParam);

    /**
     * 获取C端用户详情
     *
     * @author gzj
     * @date  2023/03/20 11:17
     **/
    ClientUser queryEntity(String id);

    /**
     * 获取C端用户
     * @param account
     * @return
     */
    ClientUser getClientUserByAccount(String account);

    /**
     * 账号是否已存在
     * @return
     */
    boolean existsByLoginAccount(String account, String id);

}
