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
package vip.xiaonuo.biz.modular.clientUser.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollStreamUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vip.xiaonuo.biz.modular.clientUser.enums.ClientUserEnum;
import vip.xiaonuo.common.enums.CommonDeleteFlagEnum;
import vip.xiaonuo.common.enums.CommonSortOrderEnum;
import vip.xiaonuo.common.exception.CommonException;
import vip.xiaonuo.common.page.CommonPageRequest;
import vip.xiaonuo.biz.modular.clientUser.entity.ClientUser;
import vip.xiaonuo.biz.modular.clientUser.mapper.ClientUserMapper;
import vip.xiaonuo.biz.modular.clientUser.param.ClientUserAddParam;
import vip.xiaonuo.biz.modular.clientUser.param.ClientUserEditParam;
import vip.xiaonuo.biz.modular.clientUser.param.ClientUserIdParam;
import vip.xiaonuo.biz.modular.clientUser.param.ClientUserPageParam;
import vip.xiaonuo.biz.modular.clientUser.service.ClientUserService;
import vip.xiaonuo.common.util.CommonCryptogramUtil;

import java.util.List;

/**
 * C端用户Service接口实现类
 *
 * @author gzj
 * @date  2023/03/20 11:17
 **/
@Service
public class ClientUserServiceImpl extends ServiceImpl<ClientUserMapper, ClientUser> implements ClientUserService {

    @Override
    public Page<ClientUser> page(ClientUserPageParam clientUserPageParam) {
        QueryWrapper<ClientUser> queryWrapper = new QueryWrapper<>();
        if(ObjectUtil.isNotEmpty(clientUserPageParam.getAccount())) {
            queryWrapper.lambda().like(ClientUser::getAccount, clientUserPageParam.getAccount());
        }
        if(ObjectUtil.isNotEmpty(clientUserPageParam.getPassword())) {
            queryWrapper.lambda().like(ClientUser::getPassword, clientUserPageParam.getPassword());
        }
        if(ObjectUtil.isNotEmpty(clientUserPageParam.getName())) {
            queryWrapper.lambda().like(ClientUser::getName, clientUserPageParam.getName());
        }
        if(ObjectUtil.isNotEmpty(clientUserPageParam.getNickname())) {
            queryWrapper.lambda().like(ClientUser::getNickname, clientUserPageParam.getNickname());
        }
        if(ObjectUtil.isNotEmpty(clientUserPageParam.getPhone())) {
            queryWrapper.lambda().like(ClientUser::getPhone, clientUserPageParam.getPhone());
        }
        if(ObjectUtil.isAllNotEmpty(clientUserPageParam.getSortField(), clientUserPageParam.getSortOrder())) {
            CommonSortOrderEnum.validate(clientUserPageParam.getSortOrder());
            queryWrapper.orderBy(true, clientUserPageParam.getSortOrder().equals(CommonSortOrderEnum.ASC.getValue()),
                    StrUtil.toUnderlineCase(clientUserPageParam.getSortField()));
        } else {
            queryWrapper.lambda().orderByAsc(ClientUser::getSortCode);
        }
        return this.page(CommonPageRequest.defaultPage(), queryWrapper);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void add(ClientUserAddParam clientUserAddParam) {
        if(existsByLoginAccount(clientUserAddParam.getAccount(),null)){
            throw new CommonException(ClientUserEnum.ACCOUNT_EXISTS.getValue());
        }
        clientUserAddParam.setPassword(CommonCryptogramUtil.doHashValue(clientUserAddParam.getPassword()));
        ClientUser clientUser = BeanUtil.toBean(clientUserAddParam, ClientUser.class);
        this.save(clientUser);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void edit(ClientUserEditParam clientUserEditParam) {
        if(existsByLoginAccount(clientUserEditParam.getAccount(),clientUserEditParam.getId())){
            throw new CommonException(ClientUserEnum.ACCOUNT_EXISTS.getValue());
        }
        ClientUser clientUser = this.queryEntity(clientUserEditParam.getId());
        BeanUtil.copyProperties(clientUserEditParam, clientUser);
        if(ObjectUtil.isNotEmpty(clientUserEditParam.getPassword())){
            clientUser.setPassword(CommonCryptogramUtil.doHashValue(clientUser.getPassword()));
        }
        this.updateById(clientUser);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void delete(List<ClientUserIdParam> clientUserIdParamList) {
        // 执行删除
        this.removeByIds(CollStreamUtil.toList(clientUserIdParamList, ClientUserIdParam::getId));
    }

    @Override
    public ClientUser detail(ClientUserIdParam clientUserIdParam) {
        return this.queryEntity(clientUserIdParam.getId());
    }

    @Override
    public ClientUser queryEntity(String id) {
        ClientUser clientUser = this.getById(id);
        if(ObjectUtil.isEmpty(clientUser)) {
            throw new CommonException("C端用户不存在，id值为：{}", id);
        }
        return clientUser;
    }

    @Override
    public ClientUser getClientUserByAccount(String account) {
        LambdaQueryWrapper<ClientUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ClientUser::getAccount,account);
        return this.getOne(wrapper);
    }

    @Override
    public boolean existsByLoginAccount(String account, String id) {
        LambdaQueryWrapper<ClientUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ClientUser::getAccount,account)
                .ne(StringUtils.isNotEmpty(id),ClientUser::getId,id)
                .last("limit 1");
        return this.count(wrapper) > 0;
    }
}
