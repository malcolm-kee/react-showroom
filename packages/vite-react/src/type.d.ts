declare module '@rollup/plugin-virtual' {
  import { PluginImpl } from 'rollup';
  const virtualPlugin: PluginImpl<Record<string, string>>;
  export default virtualPlugin;
}
