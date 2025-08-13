export type metric_db = 
  | 'db_cpu_kernel'
  | 'db_cpu_usergm'
  | 'db_mem_phy'
  | 'db_mem_vir'
  | 'db_qps'
  | 'db_tps'
  | 'db_hit_ratio'
  | 'db_fetch_pages'
  | 'db_dirty_pages'
  | 'db_io_read'
  | 'db_io_write'
  | 'db_ha_copy_delay_page'
  | 'db_ha_copy_delay_estimated'
  | 'db_ha_apply_delay_page'
  | 'db_ha_apply_delay_estimated'
  | 'db_freespace'; 

export type metric_vol = "vol_freespace";

export type metric_broker = 
  | 'broker_tps'
  | 'broker_qps'
  | 'broker_long_t'
  | 'broker_long_q'
  | 'broker_req'
  | 'broker_err_q'
  | 'broker_jq';

export type metric_os = 
  | 'os_cpu_idle'
  | 'os_cpu_iowait'
  | 'os_cpu_kernel'
  | 'os_cpu_user'
  | 'os_mem_phy_free'
  | 'os_mem_swap_free'
  | 'os_disk_free';

// Union of all possible metrics
export type AllMetrics = metric_db | metric_vol | metric_broker | metric_os; 

export type MetricByType = {
  db : metric_db,
  vol : metric_vol,
  broker : metric_broker,
  os: metric_os 
}